import os
import json
import psycopg

from typing import AsyncGenerator, Dict, Any
from pinecone import Pinecone

from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_postgres import PostgresChatMessageHistory

# Configuration
SYSTEM_PROMPT = "You're an assistant. Bold key terms in your responses."
MODEL_CONFIG = {
    "name": "claude-3-5-sonnet-20240620",
    "temperature": 0.2,
    "max_tokens": 1024
}

class Chat:
    def __init__(self):
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

    def get_message_history(self, session_id: str) -> PostgresChatMessageHistory:
        conn_info = os.getenv("POSTGRES_URL")
        sync_connection = psycopg.connect(conn_info)

        return PostgresChatMessageHistory(
            'chat_history',
            session_id,
            sync_connection=sync_connection
        )
    
    def generate_embedding(self, prompt: str) -> list:
        embedding = self.pinecone.inference.embed(
            model="llama-text-embed-v2",
            inputs=[prompt],
            parameters={ "input_type": "query" }
        )

        return embedding[0].values
    
    def get_relevant_context(self, embedding: list, top_k: int = 3) -> str:
            
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

    async def stream_chat_response(self, session_id: str, prompt: str, embedding: list) -> AsyncGenerator[str, None]:
        history = self.get_message_history(session_id)
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
        event_type = evt["event"]
        
        if event_type == "on_chat_model_start":
            history.add_user_message(prompt)
            return json.dumps({"event": event_type}, separators=(',', ':'))
            
        elif event_type == "on_chat_model_stream":
            return json.dumps({
                "event": event_type,
                "data": evt["data"]['chunk'].content
            }, separators=(',', ':'))
            
        elif event_type == "on_chat_model_end":
            history.add_ai_message(evt['data']['output'].content)
            return json.dumps({"event": event_type}, separators=(',', ':'))
