from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class Prompt(BaseModel):
    content: str
    sessionId: str
    userId: str

class Session(BaseModel):
    id: UUID
    title: str
    created_at: datetime
