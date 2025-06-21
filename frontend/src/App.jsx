import socket from "./socket";
import React, { useState, useEffect } from "react";
import Player from "./components/player";
import Feedback from "./components/feedback";

const playlist = [
  { title: "Track 1", url: "/songs/track1.mp3" },
  { title: "Track 2", url: "/songs/track2.mp3" }
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [gesture, setGesture] = useState(null); // for feedback display

  const currentTrack = playlist[currentIndex];

  // Handle gesture type (used by both socket and keyboard)
  const handleGesture = (type) => {
    setGesture(type);

    if (type === "volume_up") {
      setVolume((v) => Math.min(1, v + 0.1));
    } else if (type === "volume_down") {
      setVolume((v) => Math.max(0, v - 0.1));
    } else if (type === "next_track") {
      setCurrentIndex((i) => (i + 1) % playlist.length);
    } else if (type === "previous_track") {
      setCurrentIndex((i) => (i - 1 + playlist.length) % playlist.length);
    } else if (type === "play_pause") {
      setIsPlaying((p) => !p);
    }

    // Clear gesture after 2 seconds
    setTimeout(() => setGesture(null), 2000);
  };

  // Handle keyboard gesture simulation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") handleGesture("volume_up");
      if (e.key === "ArrowDown") handleGesture("volume_down");
      if (e.key === " ") handleGesture("play_pause");
      if (e.key === "ArrowRight") handleGesture("next_track");
      if (e.key === "ArrowLeft") handleGesture("previous_track");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Handle gesture socket connection
  useEffect(() => {
    socket.on("gesture", (data) => {
      console.log("Gesture received:", data);
      handleGesture(data.type);
    });

    return () => {
      socket.off("gesture");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Feedback gesture={gesture} />
      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
      />
    </div>
  );
};

export default App;
