from dotenv import load_dotenv

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.services import Chat
from app.schemas import ChatSessionPrompt

load_dotenv()

router = APIRouter(prefix="/chat", tags=["chat"])

chat_service = Chat()

@router.post("/completion")
async def chat_completion(prompt: ChatSessionPrompt) -> StreamingResponse:
    return StreamingResponse(
        chat_service.stream_chat_response(prompt.sessionId, prompt.content),
        media_type='text/event-stream'
    )
