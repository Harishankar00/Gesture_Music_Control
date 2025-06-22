# gestures.py

import time

# MediaPipe Hand Landmark indices
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

        # Keep only last 1.2 seconds of data
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
        self.cooldown = 2  # in seconds
        self.swipe_tracker = SwipeTracker()

    def fingers_up(self, landmarks):
        # A finger is up if tip.y < base.y (higher on the screen)
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

        # ✅ Play/Pause: Index and Middle up, others down
        if (
            fingers["index"]
            and fingers["middle"]
            and not fingers["ring"]
            and not fingers["pinky"]
            and not fingers["thumb"]
        ):
            self.last_gesture_time = current_time
            return "play_pause"

        # ✅ Volume Up: Only index finger up
        if (
            fingers["index"]
            and not fingers["middle"]
            and not fingers["ring"]
            and (not fingers["pinky"] or not fingers["thumb"])
        ):
            self.last_gesture_time = current_time
            return "volume_up"

        # ✅ Volume Down: All fingers down
        if not any(fingers.values()):
            self.last_gesture_time = current_time
            return "volume_down"

        # ✅ Swipe: All fingers up, check left/right
        if all(fingers.values()):
            wrist_x = landmarks[WRIST].x
            self.swipe_tracker.update(wrist_x, current_time)
            swipe = self.swipe_tracker.detect_swipe()
            if swipe:
                self.last_gesture_time = current_time
                return swipe
        # 👍 Play/Pause: only thumb up
        if (
            fingers["thumb"]
            and not fingers["index"]
            and not fingers["middle"]
            and not fingers["ring"]
            and not fingers["pinky"]
        ):
            self.last_gesture_time = current_time
            return "play_pause"

        return None
