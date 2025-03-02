from pydantic import BaseModel

class ChatSessionPrompt(BaseModel):
    content: str
    sessionId: str
    userId: str

class Session(BaseModel):
    id: str
    title: str
    createdAt: str
