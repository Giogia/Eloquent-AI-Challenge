from dotenv import load_dotenv
from uuid import uuid4

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.services import ChatService
from app.schemas import Prompt, Session
from app.routers.auth import auth_service, oauth2_scheme

load_dotenv()

router = APIRouter(prefix="/chat", tags=["chat"])

chat_service = ChatService()

@router.post("/completion")
async def chat_completion(prompt: Prompt, token: str = Depends(oauth2_scheme)):

    user_id = auth_service.validate_token(token)

    embedding = chat_service.generate_embedding(prompt.content)

    return StreamingResponse(
        chat_service.stream_chat_response(
            prompt.sessionId, 
            user_id, 
            prompt.content, 
            embedding
        ),
        media_type='text/event-stream'
    )

@router.get("/sessions", response_model=list[Session])
async def get_sessions(token: str = Depends(oauth2_scheme)):

    user_id = auth_service.validate_token(token)
    
    sessions = chat_service.sessions.get_sessions(user_id)

    return sessions

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str, token: str = Depends(oauth2_scheme)):

    auth_service.validate_token(token)
    
    history = chat_service.sessions.get_message_history(session_id)

    messages_with_ids = [
        {
            "id": str(uuid4()),
            "content": msg.content,
            "type": msg.type
        } for msg in history.messages
    ]

    return {"messages": messages_with_ids}
