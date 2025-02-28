from sqlalchemy import Column, Integer, UUID, JSON, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
    
class ChatHistory(Base):
    __tablename__ = 'chat_history'
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(UUID, nullable=False)
    message = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now())
