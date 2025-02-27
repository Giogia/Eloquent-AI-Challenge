from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

@app.post("/api/chat")
def chat_endpoint(query: dict):
    return {"response": f"You said: {query['message']}"}
