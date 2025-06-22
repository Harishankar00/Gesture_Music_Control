import React, { useEffect, useState } from "react";

const Player = ({
  currentTrack,
  isPlaying,
  volume,
  setVolume,
  setIsPlaying,
  setCurrentIndex,
  playlistLength,
  audioRef,
}) => {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Sync volume and playback state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;

      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("play error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, volume]);

  // Update current time & duration
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => setDuration(audio.duration || 0);

    if (audio) {
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", setAudioData);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", setAudioData);
      }
    };
  }, [audioRef, currentTrack]);

  // Handlers
  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % playlistLength);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + playlistLength) % playlistLength);

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      <h2>{currentTrack.title}</h2>
      <p>Volume: {Math.round(volume * 100)}%</p>

      {/* Playback Controls */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handlePrev}>⏮ Prev</button>
        <button onClick={handlePlayPause}>
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </button>
        <button onClick={handleNext}>⏭ Next</button>
      </div>

      {/* Track progress bar */}
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={currentTime}
        onChange={handleSeek}
        style={{ width: "100%" }}
      />
      <div>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Volume slider (controlled) */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        style={{ width: "100%", marginTop: "1rem" }}
      />

      <audio ref={audioRef} src={currentTrack.url} />
    </div>
  );
};

const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default Player;
