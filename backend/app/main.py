from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.db.database import engine
from app.db.models import Base
from app.routers import healthcheck, chat

load_dotenv()

app = FastAPI()

Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "https://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(healthcheck.router)
app.include_router(chat.router)
