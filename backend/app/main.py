from fastapi import FastAPI
from dotenv import load_dotenv

from app.db.database import engine
from app.db.models import Base
from app.routers import healthcheck, chat

load_dotenv()

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(healthcheck.router)
app.include_router(chat.router)
