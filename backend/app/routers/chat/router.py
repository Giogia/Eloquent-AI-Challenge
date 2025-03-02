from dotenv import load_dotenv
from uuid import uuid4

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.services import Chat
from app.schemas import ChatSessionPrompt

load_dotenv()

router = APIRouter(prefix="/chat", tags=["chat"])

chat_service = Chat()

@router.post("/completion")
async def chat_completion(prompt: ChatSessionPrompt) -> StreamingResponse:

    embedding = chat_service.generate_embedding(prompt.content)

    return StreamingResponse(
        chat_service.stream_chat_response(
            prompt.sessionId, 
            prompt.userId, 
            prompt.content, 
            embedding
        ),
        media_type='text/event-stream'
    )

@router.get("/sessions/{user_id}")
async def get_sessions(user_id: str):
    
    sessions = chat_service.sessions.get_sessions(user_id)

    return sessions

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    
    history = chat_service.sessions.get_message_history(session_id)

    messages_with_ids = [
        {
            "id": str(uuid4()),
            "content": msg.content,
            "type": msg.type
        } for msg in history.messages
    ]

    return {"messages": messages_with_ids}
