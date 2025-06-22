import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import threading
from gesture_controller import start_gesture_detection

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
app = FastAPI()
app_socket = socketio.ASGIApp(sio, other_asgi_app=app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gesture_thread_started = False

@app.on_event("startup")
async def startup_event():
    global gesture_thread_started
    if not gesture_thread_started:
        loop = asyncio.get_running_loop()
        threading.Thread(
            target=start_gesture_detection,
            args=(sio, loop),
            daemon=True
        ).start()
        gesture_thread_started = True
