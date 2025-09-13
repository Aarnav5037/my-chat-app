from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Allow your frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://my-chat-n0h3e3q1i-aarnav-agarwals-projects.vercel.app"],  # Replace "*" with your Vite URL if you want stricter security
    allow_methods=["https://my-chat-n0h3e3q1i-aarnav-agarwals-projects.vercel.app"],
    allow_headers=["https://my-chat-n0h3e3q1i-aarnav-agarwals-projects.vercel.app"]
)

# Load your precomputed responses
with open("responses.json", "r") as f:
    RESPONSES = json.load(f)

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    message = data.get("message", "").strip()
    reply = RESPONSES.get(message, "Sorry, I don’t have a response for that.")
    return {"reply": reply}
