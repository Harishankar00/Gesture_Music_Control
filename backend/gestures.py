# gestures.py

import time

# MediaPipe finger landmark indexes
WRIST = 0
INDEX_TIP = 8
INDEX_BASE = 5
MIDDLE_TIP = 12
MIDDLE_BASE = 9
RING_TIP = 16
RING_BASE = 13
PINKY_TIP = 20
PINKY_BASE = 17
THUMB_TIP = 4
THUMB_BASE = 2

class SwipeTracker:
    def __init__(self):
        self.positions = []
        self.timestamps = []

    def update(self, x, timestamp):
        self.positions.append(x)
        self.timestamps.append(timestamp)

        # Keep last 1.2s of motion
        while self.timestamps and (timestamp - self.timestamps[0]) > 1.2:
            self.positions.pop(0)
            self.timestamps.pop(0)

    def detect_swipe(self):
        if len(self.positions) < 3:
            return None

        delta_x = self.positions[-1] - self.positions[0]
        speed = abs(delta_x) / (self.timestamps[-1] - self.timestamps[0])

        if abs(delta_x) > 0.4 and speed > 0.4:
            return "next_track" if delta_x > 0 else "prev_track"
        return None


class GestureRecognizer:
    def __init__(self):
        self.last_gesture_time = 0
        self.cooldown = 2
        self.swipe_tracker = SwipeTracker()

    def fingers_up(self, landmarks):
        # Finger is up if tip Y is above base Y (lower Y value in image coordinates)
        return {
            "thumb": landmarks[THUMB_TIP].y < landmarks[THUMB_BASE].y,
            "index": landmarks[INDEX_TIP].y < landmarks[INDEX_BASE].y,
            "middle": landmarks[MIDDLE_TIP].y < landmarks[MIDDLE_BASE].y,
            "ring": landmarks[RING_TIP].y < landmarks[RING_BASE].y,
            "pinky": landmarks[PINKY_TIP].y < landmarks[PINKY_BASE].y,
        }

    def detect_gesture(self, landmarks, image_height, image_width):
        current_time = time.time()
        if current_time - self.last_gesture_time < self.cooldown:
            return None

        fingers = self.fingers_up(landmarks)

        # Case 1: Only index finger is up → volume_up
        if fingers["index"] and not any(fingers[f] for f in ["middle", "ring", "pinky", "thumb"]):
            self.last_gesture_time = current_time
            return "volume_up"

        # Case 2: All fingers down → volume_down
        if not any(fingers.values()):
            self.last_gesture_time = current_time
            return "volume_down"

        # Case 3: All fingers up → check for swipe
        if all(fingers.values()):
            wrist_x = landmarks[WRIST].x
            self.swipe_tracker.update(wrist_x, current_time)
            swipe = self.swipe_tracker.detect_swipe()
            if swipe:
                self.last_gesture_time = current_time
                return swipe

        return None
