import cv2
import mediapipe as mp
import time
import asyncio
import socketio  # for type hinting
from gestures import GestureRecognizer

# Initialize MediaPipe
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Gesture recognizer instance
recognizer = GestureRecognizer()


def start_gesture_detection(sio: socketio.AsyncServer, loop):
    """
    Capture webcam frames, detect gestures using MediaPipe and GestureRecognizer,
    and emit gesture events to connected Socket.IO clients via the provided event loop.
    """
    cap = cv2.VideoCapture(0)
    hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.5)

    while True:
        success, frame = cap.read()
        if not success:
            continue

        # Mirror image for natural interaction
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)

        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame, hand_landmarks, mp_hands.HAND_CONNECTIONS
                )

                # Detect gesture
                gesture = recognizer.detect_gesture(
                    hand_landmarks.landmark, frame.shape[0], frame.shape[1]
                )

                if gesture:
                    print(f"[DEBUG] Emitting gesture to loop: {gesture}")
                    # Emit via the main event loop provided
                    asyncio.run_coroutine_threadsafe(
                        sio.emit("gesture", {"type": gesture}, namespace="/"),
                        loop
                    )
                    print(f"[GESTURE] Emitted: {gesture}")

        # Display for debugging (press Q to quit)
        cv2.imshow("Webcam - Press Q to exit", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    # Cleanup
    cap.release()
    cv2.destroyAllWindows()

