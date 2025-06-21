// src/socket.js
import { io } from "socket.io-client";

// Update URL if backend runs on a different host/port
const socket = io("http://localhost:8000");

export default socket;
