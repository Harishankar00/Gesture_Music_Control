import threading
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio

from gesture_controller import start_gesture_detection

# Create Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app_socket = socketio.ASGIApp(sio, app)

# Get the event loop BEFORE starting the thread
main_loop = asyncio.get_event_loop()

def start_gesture_loop():
    threading.Thread(target=start_gesture_detection, args=(sio, main_loop), daemon=True).start()

# Start gesture thread here
start_gesture_loop()

if __name__ == "__main__":
    uvicorn.run(app_socket, host="0.0.0.0", port=8000)
