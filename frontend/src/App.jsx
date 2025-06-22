import React, { useState, useEffect, useRef } from "react";
import Player from "./components/player";
import socket from "./socket"; // If backend connected via socket
import Feedback from "./components/feedback"; // Optional

const playlist = [
  { title: "Track 1", url: "/songs/track1.mp3", image: "/songs/track1.png" },
  { title: "Track 2", url: "/songs/track2.mp3", image: "/songs/track2.png" },
];


const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [gesture, setGesture] = useState(null);
  const audioRef = useRef(null);

  // Handle gesture input from backend via socket (optional)
  useEffect(() => {
    socket.on("gesture", ({ type }) => {
      handleGesture(type);
    });

    // Clean up socket on component unmount
    return () => {
      socket.off("gesture");
    };
  }, []);

  const handleGesture = (type) => {
    switch (type) {
      case "play_pause":
        setIsPlaying((prev) => !prev);
        break;
      case "next_track":
        setCurrentIndex((prev) => (prev + 1) % playlist.length);
        break;
      case "previous_track":
        setCurrentIndex((prev) =>
          prev === 0 ? playlist.length - 1 : prev - 1
        );
        break;
      case "volume_up":
        setVolume((v) => Math.min(1, v + 0.1));
        break;
      case "volume_down":
        setVolume((v) => Math.max(0, v - 0.1));
        break;
      default:
        break;
    }

    setGesture(type);
    setTimeout(() => setGesture(null), 2000);
  };

  return (
    <div>
      <Player
        currentTrack={playlist[currentIndex]}
        isPlaying={isPlaying}
        volume={volume}
        setVolume={setVolume} // ✅ Pass setVolume
        setIsPlaying={setIsPlaying}
        setCurrentIndex={setCurrentIndex}
        playlistLength={playlist.length}
        audioRef={audioRef}
      />

      {/* Optional gesture feedback */}
      {/* <Feedback gesture={gesture} /> */}
    </div>
  );
};

export default App;

