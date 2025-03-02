from uuid import uuid4

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.db.connection import get_db
from app.services import ChatService
from app.schemas import Prompt, Message, ChatHistory, Session
from app.routers.auth import auth_service, oauth2_scheme

chat_service = ChatService()

router = APIRouter(prefix="/chat", tags=["chat"])

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
    
    with get_db() as db:
        sessions = chat_service.sessions.get_sessions(user_id, db)

        return [
            Session(
                id=session.id, 
                title=session.title,
                created_at=session.created_at
            ) 
            for session in sessions
        ]


@router.get("/history/{session_id}", response_model=ChatHistory)
async def get_chat_history(session_id: str, token: str = Depends(oauth2_scheme)):

    auth_service.validate_token(token)
    
    history = chat_service.sessions.get_message_history(session_id)

    return ChatHistory(
        messages = [
            Message(
                id=str(uuid4()),
                content=message.content,
                type=message.type
            ) for message in history.messages
        ]
    )
