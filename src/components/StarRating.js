import React from "react";
import { HiStar, HiOutlineStar } from "react-icons/hi";

const StarRating = ({ rating, onRating }) => {
  const totalStars = 5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button key={starValue} onClick={() => onRating(starValue)}>
            {starValue <= rating ? (
              <HiStar className="h-7 w-7 text-yellow-400" />
            ) : (
              <HiOutlineStar className="h-7 w-7 text-yellow-400" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
