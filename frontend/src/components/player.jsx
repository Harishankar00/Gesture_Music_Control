// src/components/player.jsx
import React, { useEffect, useRef } from "react";

const Player = ({ currentTrack, isPlaying, volume }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    if (isPlaying) {
      audio.play().catch((e) => {
        console.error("Playback error:", e);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, volume, currentTrack]);

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{currentTrack.title}</h2>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        controls
        className="w-full"
      />
      <p className="mt-2 text-sm text-gray-500">Volume: {Math.round(volume * 100)}%</p>
    </div>
  );
};

export default Player;
