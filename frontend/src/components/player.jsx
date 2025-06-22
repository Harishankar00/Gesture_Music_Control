import React, { useEffect, useState } from "react";
import "../styles/player.css"; // Canva-inspired styling

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

  // Sync volume and play/pause
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

  // Track time updates
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

  const handlePlayPause = () => setIsPlaying((prev) => !prev);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % playlistLength);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + playlistLength) % playlistLength);

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    audioRef.current.volume = newVol;
    setVolume(newVol); // Keep state and audioRef in sync
  };

  return (
    <div className="player-container">
      <h1 className="title">GESTURE MUSIC 💖</h1>
      <h2 className="track-title">{currentTrack.title}</h2>

      <div className="cd-container">
        <img
          src={currentTrack.image || "/songs/cd-default.png"}
          alt="CD cover"
          className={`cd ${isPlaying ? "rotate" : ""}`}
        />
      </div>

      <div className="controls-top">
        <i className="fas fa-heart"></i>
        <i className="fas fa-volume-up"></i>
      </div>

      <input
        className="progress"
        type="range"
        min="0"
        max={duration || 0}
        step="0.1"
        value={currentTime}
        onChange={handleSeek}
      />
      <div>{formatTime(currentTime)} / {formatTime(duration)}</div>

      <div className="controls">
        <button onClick={handlePrev}>
          <i className="fas fa-backward"></i>
        </button>
        <button onClick={handlePlayPause}>
          <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
        </button>
        <button onClick={handleNext}>
          <i className="fas fa-forward"></i>
        </button>
      </div>

      <input
        className="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
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
