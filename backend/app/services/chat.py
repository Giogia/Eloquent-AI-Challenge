import os
import json
import psycopg

from typing import AsyncGenerator, Dict, Any

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

    def get_message_history(self, session_id: str) -> PostgresChatMessageHistory:
        conn_info = os.getenv("POSTGRES_URL")
        sync_connection = psycopg.connect(conn_info)

        return PostgresChatMessageHistory(
            'chat_history',
            session_id,
            sync_connection=sync_connection
        )

    async def stream_chat_response(self, session_id: str, prompt: str) -> AsyncGenerator[str, None]:
        history = self.get_message_history(session_id)
        messages = self.prompt_template.format_messages(
            input=prompt,
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
