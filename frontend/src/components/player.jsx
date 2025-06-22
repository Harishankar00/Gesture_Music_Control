// import React, { useEffect, useState } from "react";
// import "../styles/player.css"; // Canva-inspired styling

// const Player = ({
//   currentTrack,
//   isPlaying,
//   volume,
//   setVolume,
//   setIsPlaying,
//   setCurrentIndex,
//   playlistLength,
//   audioRef,
// }) => {
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);

//   // Sync volume and play/pause
//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = volume;
//       if (isPlaying) {
//         audioRef.current.play().catch((err) => console.log("play error:", err));
//       } else {
//         audioRef.current.pause();
//       }
//     }
//   }, [isPlaying, currentTrack, volume]);

//   // Track time updates
//   useEffect(() => {
//     const audio = audioRef.current;

//     const updateTime = () => setCurrentTime(audio.currentTime);
//     const setAudioData = () => setDuration(audio.duration || 0);

//     if (audio) {
//       audio.addEventListener("timeupdate", updateTime);
//       audio.addEventListener("loadedmetadata", setAudioData);
//     }

//     return () => {
//       if (audio) {
//         audio.removeEventListener("timeupdate", updateTime);
//         audio.removeEventListener("loadedmetadata", setAudioData);
//       }
//     };
//   }, [audioRef, currentTrack]);

//   const handlePlayPause = () => setIsPlaying((prev) => !prev);

//   const handleNext = () =>
//     setCurrentIndex((prev) => (prev + 1) % playlistLength);

//   const handlePrev = () =>
//     setCurrentIndex((prev) => (prev - 1 + playlistLength) % playlistLength);

//   const handleSeek = (e) => {
//     const newTime = parseFloat(e.target.value);
//     audioRef.current.currentTime = newTime;
//     setCurrentTime(newTime);
//   };

//   const handleVolumeChange = (e) => {
//     const newVol = parseFloat(e.target.value);
//     audioRef.current.volume = newVol;
//     setVolume(newVol); // Keep state and audioRef in sync
//   };

//   return (
//     <div className="player-container">
//       <h1 className="title">GESTURE MUSIC 💖</h1>
//       <h2 className="track-title">{currentTrack.title}</h2>

//       <div className="cd-container">
//         <img
//           src={currentTrack.image || "/songs/cd-default.png"}
//           alt="CD cover"
//           className={`cd ${isPlaying ? "rotate" : ""}`}
//         />
//       </div>

//       <div className="controls-top">
//         <i className="fas fa-heart"></i>
//         <i className="fas fa-volume-up"></i>
//       </div>

//       <input
//         className="progress"
//         type="range"
//         min="0"
//         max={duration || 0}
//         step="0.1"
//         value={currentTime}
//         onChange={handleSeek}
//       />
//       <div>{formatTime(currentTime)} / {formatTime(duration)}</div>

//       <div className="controls">
//         <button onClick={handlePrev}>
//           <i className="fas fa-backward"></i>
//         </button>
//         <button onClick={handlePlayPause}>
//           <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
//         </button>
//         <button onClick={handleNext}>
//           <i className="fas fa-forward"></i>
//         </button>
//       </div>

//       <input
//         className="volume"
//         type="range"
//         min="0"
//         max="1"
//         step="0.01"
//         value={volume}
//         onChange={handleVolumeChange}
//       />

//       <audio ref={audioRef} src={currentTrack.url} />
//     </div>
//   );
// };

// const formatTime = (time) => {
//   if (isNaN(time)) return "0:00";
//   const minutes = Math.floor(time / 60);
//   const seconds = Math.floor(time % 60)
//     .toString()
//     .padStart(2, "0");
//   return `${minutes}:${seconds}`;
// };

// export default Player;
import React, { useEffect, useState } from "react";
import "../styles/player.css"; // Enhanced styling

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
      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-orb orb-4"></div>
      </div>

      {/* Main Player Card */}
      <div className="player-card">
        {/* Header Section */}
        <div className="player-header">
          <div className="logo-section">
            <div className="music-icon">🎵</div>
            <h1 className="title">
              <span className="title-gesture">GESTURE</span>
              <span className="title-music">MUSIC</span>
              <div className="heart-pulse">💖</div>
            </h1>
          </div>
        </div>

        {/* Track Info Section */}
        <div className="track-info">
          <div className="track-visual">
            <div className="cd-container">
              <div className="cd-glow"></div>
              <div className="cd-outer-ring"></div>
              <img
                src={currentTrack.image || "/songs/cd-default.png"}
                alt="CD cover"
                className={`cd ${isPlaying ? "rotate" : ""}`}
              />
              <div className="cd-center-dot"></div>
              <div className="cd-reflection"></div>
            </div>
            
            {/* Equalizer Visualization */}
            <div className={`equalizer ${isPlaying ? 'active' : ''}`}>
              <div className="eq-bar"></div>
              <div className="eq-bar"></div>
              <div className="eq-bar"></div>
              <div className="eq-bar"></div>
              <div className="eq-bar"></div>
            </div>
          </div>

          <div className="track-details">
            <h2 className="track-title">{currentTrack.title}</h2>
            <p className="track-artist">Gesture Control Session</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="time-display">
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="total-time">{formatTime(duration)}</span>
          </div>
          
          <div className="progress-container">
            <input
              className="progress-slider"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
            />
            <div 
              className="progress-fill" 
              style={{width: `${duration ? (currentTime / duration) * 100 : 0}%`}}
            ></div>
            <div className="progress-track"></div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="controls-section">
          <div className="main-controls">
            <button className="control-btn secondary" onClick={handlePrev}>
              <i className="fas fa-step-backward"></i>
            </button>
            
            <button className="control-btn primary play-pause" onClick={handlePlayPause}>
              <div className="btn-glow"></div>
              <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
            </button>
            
            <button className="control-btn secondary" onClick={handleNext}>
              <i className="fas fa-step-forward"></i>
            </button>
          </div>
        </div>

        {/* Volume Section */}
        <div className="volume-section">
          <div className="volume-controls">
            <button className="volume-icon">
              <i className={`fas ${volume > 0.5 ? 'fa-volume-up' : volume > 0 ? 'fa-volume-down' : 'fa-volume-mute'}`}></i>
            </button>
            
            <div className="volume-container">
              <input
                className="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
              <div 
                className="volume-fill" 
                style={{width: `${volume * 100}%`}}
              ></div>
              <div className="volume-track"></div>
            </div>
            
            <span className="volume-percentage">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>

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