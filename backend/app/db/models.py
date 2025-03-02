from sqlalchemy import Column, ForeignKey, Integer, UUID, JSON, DateTime, String, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

Db = Session

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(UUID, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Session(Base):
    __tablename__ = 'sessions'
    id = Column(UUID, primary_key=True, index=True)
    title = Column(String, nullable=False)
    user_id = Column(UUID, ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
class ChatHistory(Base):
    __tablename__ = 'chat_history'
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(UUID, ForeignKey('sessions.id'), nullable=False)
    message = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
