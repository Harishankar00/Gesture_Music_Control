// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  transports: ["websocket"],  // 🔥 Enforce WS, avoid polling fallback
  reconnectionAttempts: 5,
  timeout: 10000,
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

export default socket;
