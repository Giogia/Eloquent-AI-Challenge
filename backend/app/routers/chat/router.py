from uuid import uuid4

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse

from app.db.connection import get_db
from app.services import ChatService
from app.schemas import Prompt, Message, ChatHistory, Session, User
from app.routers.auth import auth_service

chat_service = ChatService()

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/completion")
async def chat_completion(prompt: Prompt, request: Request):

    access_token = request.cookies.get("access_token")

    user_id = auth_service.validate_token(access_token)

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
async def get_sessions(request: Request):

    access_token = request.cookies.get("access_token")

    user_id = auth_service.validate_token(access_token)
    
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
async def get_chat_history(session_id: str, request: Request):

    access_token = request.cookies.get("access_token")

    auth_service.validate_token(access_token)
    
    history = chat_service.sessions.get_message_history(session_id)

    if not history:
        raise HTTPException(status_code=404, detail="Session history not found")

    return ChatHistory(
        messages = [
            Message(
                id=str(uuid4()),
                content=message.content,
                type=message.type
            ) for message in history.messages
        ]
    )

@router.get("/user", response_model=User)
async def get_user(request: Request):

    access_token = request.cookies.get("access_token")

    user_id = auth_service.validate_token(access_token)

    with get_db() as db:
        user = auth_service.users.get_user_by_id(user_id, db)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return User(
            id=user.id,
            email=user.email,
            username=user.username
        )
