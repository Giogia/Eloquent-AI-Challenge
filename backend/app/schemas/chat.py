from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class Prompt(BaseModel):
    content: str
    sessionId: str

class Message(BaseModel):
    id: UUID
    content: str
    type: str

class ChatHistory(BaseModel):
    messages: list[Message]

class Session(BaseModel):
    id: UUID
    title: str
    created_at: datetime

class User(BaseModel):
    id: UUID
    email: str
    username: str
