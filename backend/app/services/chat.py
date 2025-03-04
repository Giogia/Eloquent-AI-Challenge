import os
import json

from typing import AsyncGenerator, Dict, Any
from pinecone import Pinecone

from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_postgres import PostgresChatMessageHistory

from app.db.connection import get_db
from app.services.sessions import Sessions

# Configuration
SYSTEM_PROMPT = "You're an assistant. Bold key terms in your responses."
MODEL_CONFIG = {
    "name": "claude-3-5-sonnet-20240620",
    "temperature": 0.2,
    "max_tokens": 1024
}

class ChatService:
    def __init__(self):
        self.sessions = Sessions()
        self.llm = ChatAnthropic(
            model_name=MODEL_CONFIG["name"],
            temperature=MODEL_CONFIG["temperature"],
            max_tokens=MODEL_CONFIG["max_tokens"]
        )
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}")
        ])
        self.pinecone = Pinecone(
            api_key=os.getenv("PINECONE_API_KEY"), 
            environment=os.getenv("PINECONE_ENV")
        )
        self.index = self.pinecone.Index(os.getenv("PINECONE_INDEX_NAME"))

    def generate_embedding(self, prompt: str) -> list:
        """
        Generate embeddings for the given prompt using Llama embedding model.
        
        Args:
            prompt (str): User prompt to generate embeddings for
            
        Returns:
            list: Vector embedding representation of the prompt
        """

        embedding = self.pinecone.inference.embed(
            model="llama-text-embed-v2",
            inputs=[prompt],
            parameters={ "input_type": "query" }
        )

        return embedding[0].values
    
    def get_relevant_context(self, embedding: list, top_k: int = 3) -> str:
        """
        Retrieve relevant context from the vector database based on the prompt embedding.
        
        Args:
            embedding (list): Vector embedding of the user prompt
            top_k (int, optional): Number of most relevant contexts to retrieve. Defaults to 3.
            
        Returns:
            str: Formatted string containing the relevant contexts
        """

        results = self.index.query(
            vector=embedding,
            top_k=top_k,
            include_values=False,
            include_metadata=True,
        )

        context = "# RELEVANT KNOWLEDGE\n\n" + "\n".join([
            f"Q: {match['metadata']['category']}\nA: {match['metadata']['text']}" 
            for match in results['matches']
        ]) + "\n\n# PROMPT\n\n"
        
        return context

    async def stream_chat_response(self, session_id: str, user_id:str, prompt: str, embedding: list) -> AsyncGenerator[str, None]:
        """
        Stream chat responses from the LLM back to the client.
        
        This method:
        1. Creates a new session if it doesn't exist
        2. Retrieves message history for the session
        3. Gets relevant context based on the prompt embedding
        4. Combines context with the prompt
        5. Streams the LLM response back to the client
        
        Args:
            session_id (str): Unique identifier for the chat session
            user_id (str): Unique identifier for the user
            prompt (str): User's input message
            embedding (list): Vector embedding of the user prompt
            
        Yields:
            str: JSON-formatted chunks of the LLM response
        """

        with get_db() as db:
            if not self.sessions.session_exists(session_id, db):
                self.sessions.create_session(session_id, user_id, prompt, db)

        history = self.sessions.get_message_history(session_id)
        context = self.get_relevant_context(embedding)

        prompt_with_context = context + prompt

        messages = self.prompt_template.format_messages(
            input=prompt_with_context,
            history=history.messages
        )

        async for evt in self.llm.astream_events(
            messages,
            version="v1",
            config={"callbacks": []},
            model=MODEL_CONFIG["name"]
        ):
            yield self._process_event(evt, prompt, history)

    def _process_event(self, evt: Dict[str, Any], prompt: str, history: PostgresChatMessageHistory) -> str:
        """
        Process LLM streaming events and format them for the client.
        
        Args:
            evt (Dict[str, Any]): Event data from the LLM
            prompt (str): Original user prompt
            history (PostgresChatMessageHistory): Chat history for the session
            
        Returns:
            str: JSON-formatted event data for the client
        """
        
        event_type = evt["event"]
        
        if event_type == "on_chat_model_start":
            history.add_user_message(prompt)
            return f"data: {json.dumps({'event': event_type})}\n\n"
        
        elif event_type == "on_chat_model_stream":
            await asyncio.sleep(0.01)  # Small delay to ensure streaming behavior
            return f"data: {json.dumps({'event': event_type, 'data': evt['data']['chunk'].content})}\n\n"
        
        elif event_type == "on_chat_model_end":
            history.add_ai_message(evt['data']['output'].content)
            return f"data: {json.dumps({'event': event_type})}\n\n"
