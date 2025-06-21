import cv2
import mediapipe as mp
import time
import asyncio
import socketio  # for type hinting

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

def start_gesture_detection(sio: socketio.AsyncServer, loop):
    cap = cv2.VideoCapture(0)
    hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.5)

    prev_gesture_time = time.time()

    while True:
        success, frame = cap.read()
        if not success:
            continue

        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)

        if result.multi_hand_landmarks:
            for hand_landmarks in result.multi_hand_landmarks:
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                current_time = time.time()
                if current_time - prev_gesture_time > 2:
                    asyncio.run_coroutine_threadsafe(
                        sio.emit("gesture", {"type": "volume_up"}),
                        loop
                    )
                    print("[GESTURE] Emitted: volume_up")
                    prev_gesture_time = current_time

        cv2.imshow("Webcam - Press Q to exit", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cap.release()
    cv2.destroyAllWindows()
