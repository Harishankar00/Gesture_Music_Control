import React from "react";

const gestureLabels = {
  volume_up: "🔊 Volume Up",
  volume_down: "🔉 Volume Down",
  play_pause: "⏯ Play / Pause",
  next_track: "⏭ Next Track",
  previous_track: "⏮ Previous Track",
};

const Feedback = ({ gesture }) => {
  if (!gesture) return null;

  return (
    <div className="absolute top-6 px-6 py-3 rounded-lg bg-black text-white text-xl shadow-lg animate-pulse">
      {gestureLabels[gesture] || gesture}
    </div>
  );
};

export default Feedback;
