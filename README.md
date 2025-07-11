# 🎵 Gesture-Controlled Music Player

Control your music playlist using hand gestures via your webcam! This project integrates computer vision (MediaPipe) and Socket.IO to detect hand gestures and control music playback on a modern React frontend.

---

## 📌 Features

- 👆 Volume Up: Raise index finger
- 👇 Volume Down: All fingers down
- 👉 Swipe Right: Next track (move full hand right)
- 👈 Swipe Left: Previous track (move full hand left)
- 👍 Play/Pause: Show thumbs up

---

## 🛠️ Tech Stack

| Component       | Technology                      |
|----------------|----------------------------------|
| Frontend       | React, Socket.IO Client          |
| Backend        | FastAPI, Socket.IO ASGI Server   |
| Gesture Engine | OpenCV, MediaPipe, Python        |
| Communication  | WebSocket (Socket.IO)            |

---


🚀 How to Run

🔧 Prerequisites

Python 3.10+

Node.js + npm

OpenCV & MediaPipe

Webcam enabled

⚙️ Backend Setup

cd backend
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Run backend with live reload
uvicorn app:app_socket --reload

Webcam window will open, and gestures will be recognized and      emitted to the frontend.

🌐 Frontend Setup

cd frontend
npm install
npm start 

Visit: http://localhost:3000

Make sure backend is running at http://localhost:8000.

🧠 Technical Notes

✔️ Working Gestures:
Hand landmarks are processed via MediaPipe in real-time.

Gesture state is throttled using a 2-second cooldown to avoid spamming.

🧩 Common Issues

Issue	Fix

1. ❌ Gesture not recognized	Ensure full hand is visible in webcam &good lighting

2. ❌ No socket connection in frontend	Check that backend runs on port 8000 and frontend on 3000

3. ❌ Event loop error in gesture_controller	Ensure event loop is passed correctly to thread from app.py

4. ❌ "Wayland plugin not found" warning	Safe to ignore, happens due to OpenCV + Qt

5. ❌ CORS issues	CORS is handled via FastAPI's middleware for all origins

6. ❌ Reload restarts webcam detection	Use production deployment without --reload for stable runs

🧪 To-Do / Enhancements

✨ Add gesture feedback animation in frontend (e.g., toast or overlay)

🎶 Upload custom audio files

📱 Mobile gesture support (via camera)

🧠 Add ML-based gesture confidence scoring
