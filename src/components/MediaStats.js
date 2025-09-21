import React from "react";
import StarRating from "./StarRating";

const MediaStats = ({ user, mediaStatus, handleRating }) => {
  if (!user || !mediaStatus.watched) {
    return null;
  }

  return (
    <div className="inline-flex flex-wrap items-center justify-center md:justify-start gap-2 bg-black/30 backdrop-blur-sm p-2 rounded-xl border border-white/10">
      <StarRating rating={mediaStatus.rating || 0} onRating={handleRating} />
    </div>
  );
};

export default MediaStats;
