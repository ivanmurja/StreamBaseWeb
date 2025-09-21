import React from "react";
import { TMDB_IMAGE_BASE_URL } from "../api/tmdb";

const CastCard = ({ person }) => {
  const placeholderImage =
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%238b949e'%3e%3cpath fill-rule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z' clip-rule='evenodd' /%3e%3c/svg%3e";

  const imageUrl = person.profile_path
    ? `${TMDB_IMAGE_BASE_URL}${person.profile_path}`
    : placeholderImage;

  return (
    <div className="w-32 flex-shrink-0">
      <div className="rounded-lg overflow-hidden bg-brand-light-dark shadow-md">
        <img
          src={imageUrl}
          alt={person.name}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.src = placeholderImage;
          }}
        />
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-bold text-white truncate">{person.name}</p>
        <p className="text-xs text-brand-text-secondary truncate">
          {person.character}
        </p>
      </div>
    </div>
  );
};

export default CastCard;
