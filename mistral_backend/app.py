from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from mistral_model import generate_reply

app = FastAPI()

# Enable CORS so your Vite frontend can call this API
origins = ["*"]  # or your frontend URL in production

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class Message(BaseModel):
    message: str

@app.post("/chat")
def chat(msg: Message):
    reply = generate_reply(msg.message)
    return {"reply": reply}
