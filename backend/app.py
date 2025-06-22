# import threading
# import socketio
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
# import asyncio

# from gesture_controller import start_gesture_detection

# # Create Socket.IO server
# sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app_socket = socketio.ASGIApp(sio, app)

# # Get the event loop BEFORE starting the thread
# main_loop = asyncio.get_event_loop()

# def start_gesture_loop():
#     threading.Thread(target=start_gesture_detection, args=(sio, main_loop), daemon=True).start()

# # Start gesture thread here
# start_gesture_loop()

# if __name__ == "__main__":
#     uvicorn.run(app_socket, host="0.0.0.0", port=8000)
# app.py

# import threading
# import socketio
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import asyncio
# from gesture_controller import start_gesture_detection

# # Create Socket.IO server
# sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# # Create FastAPI app
# app = FastAPI()

# # Enable CORS for frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # or ["http://localhost:3000"]
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Mount FastAPI inside socket.io ASGI app
# app_socket = socketio.ASGIApp(sio, other_asgi_app=app)

# # Start gesture detection in background thread
# def start_gesture_loop():
#     loop = asyncio.new_event_loop()
#     asyncio.set_event_loop(loop)
#     start_gesture_detection(sio, loop)  # ✅ Pass loop

# threading.Thread(target=start_gesture_loop, daemon=True).start()

# # 👇 This is for running with `python app.py`
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("app:app_socket", host="0.0.0.0", port=8000, reload=True)
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
