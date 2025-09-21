import React from "react";
import { Link } from "react-router-dom";
import { HiStar } from "react-icons/hi2";
import { TMDB_IMAGE_BASE_URL } from "../api/tmdb";

const ActivityCard = ({ activity }) => {
  const defaultAvatar =
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%238b949e'%3e%3cpath fill-rule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z' clip-rule='evenodd' /%3e%3c/svg%3e";

  const getActionText = () => {
    switch (activity.type) {
      case "rated":
        return (
          <>
            avaliou o
            <span className="font-semibold">
              {activity.mediaType === "movie" ? " filme" : " série"}
            </span>{" "}
            <Link
              to={`/details/${activity.mediaType}/${activity.mediaId}`}
              className="text-brand-primary hover:underline"
            >
              "{activity.mediaTitle}"
            </Link>
            com <HiStar className="inline-block h-4 w-4 text-yellow-400" />
            {activity.rating}/5
          </>
        );
      case "watched":
        return (
          <>
            assistiu ao
            <span className="font-semibold">
              {activity.mediaType === "movie" ? " filme" : " série"}
            </span>{" "}
            <Link
              to={`/details/${activity.mediaType}/${activity.mediaId}`}
              className="text-brand-primary hover:underline"
            >
              "{activity.mediaTitle}"
            </Link>
          </>
        );
      case "added_to_watchlist":
        return (
          <>
            adicionou à sua lista o
            <span className="font-semibold">
              {activity.mediaType === "movie" ? " filme" : " série"}
            </span>{" "}
            <Link
              to={`/details/${activity.mediaType}/${activity.mediaId}`}
              className="text-brand-primary hover:underline"
            >
              "{activity.mediaTitle}"
            </Link>
          </>
        );
      default:
        return "realizou uma atividade.";
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "";
    return new Date(timestamp.toDate()).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="bg-brand-dark p-4 rounded-lg border border-brand-border flex items-start space-x-4">
      <Link to={`/profile/${activity.userId}`}>
        <img
          src={activity.userPhotoURL || defaultAvatar}
          alt="Avatar do Usuário"
          className="w-10 h-10 rounded-full object-cover border-2 border-brand-primary"
        />
      </Link>
      <div className="flex-1">
        <p className="text-brand-text-secondary text-sm">
          <Link
            to={`/profile/${activity.userId}`}
            className="font-bold text-white hover:underline"
          >
            {activity.userName}
          </Link>{" "}
          {getActionText()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatTimestamp(activity.timestamp)}
        </p>
      </div>
      {activity.mediaPoster && (
        <Link to={`/details/${activity.mediaType}/${activity.mediaId}`}>
          <img
            src={`${TMDB_IMAGE_BASE_URL}${activity.mediaPoster}`}
            alt={activity.mediaTitle}
            className="w-16 h-24 object-cover rounded-md shadow-md flex-shrink-0"
          />
        </Link>
      )}
    </div>
  );
};

export default ActivityCard;
