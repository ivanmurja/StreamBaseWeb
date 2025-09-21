import React from "react";
import { Link } from "react-router-dom";
import { HiStar } from "react-icons/hi2";

const ReviewCard = ({ review }) => {
  const defaultAvatar =
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%238b949e'%3e%3cpath fill-rule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z' clip-rule='evenodd' /%3e%3c/svg%3e";

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Data Indisponível";
    return new Date(timestamp.toDate()).toLocaleDateString("pt-BR");
  };

  return (
    <div className="bg-brand-dark p-5 rounded-lg border border-brand-border">
      <div className="flex items-center mb-3">
        <img
          src={review.userPhotoURL || defaultAvatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <Link
            to={`/profile/${review.userId}`}
            className="font-semibold text-white text-lg hover:underline"
          >
            {review.userName}
          </Link>
          <p className="text-xs text-brand-text-secondary">
            {formatTimestamp(review.createdAt)}
          </p>
        </div>
        <div className="ml-auto flex items-center">
          {[...Array(5)].map((_, i) => (
            <HiStar
              key={i}
              className={`h-5 w-5 ${
                i < review.rating ? "text-yellow-400" : "text-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
      <h4 className="font-bold text-xl text-white mb-2">{review.title}</h4>
      <p className="text-brand-text-secondary leading-relaxed">{review.text}</p>
    </div>
  );
};

export default ReviewCard;
