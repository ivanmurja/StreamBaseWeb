import React from "react";
import { Link } from "react-router-dom";
import { TMDB_IMAGE_BASE_URL } from "../api/tmdb";
import { HiStar } from "react-icons/hi2";

const MovieCard = ({
  id,
  poster,
  title,
  year,
  rating,
  userRating,
  mediaType,
  watched,
}) => {
  const placeholderImage =
    "https://placehold.co/300x450/0d1117/c9d1d9?text=Imagem+Indisponivel";

  const imageUrl = poster
    ? `${TMDB_IMAGE_BASE_URL}${poster}`
    : placeholderImage;

  return (
    <Link to={`/details/${mediaType}/${id}`} className="block group">
      <div className="relative rounded-lg overflow-hidden bg-brand-light-dark shadow-lg shadow-black/50 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-brand-primary/20">
        <img
          src={imageUrl}
          alt={`Pôster de ${title}`}
          className="w-full h-full object-cover transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholderImage;
          }}
        />
        <div className="absolute top-2 right-2 flex flex-row items-center gap-2 z-20">
          {userRating > 0 && (
            <div
              className="bg-purple-600/90 backdrop-blur-sm text-white font-bold text-xs px-2 py-1 rounded-full flex items-center gap-1"
              title={`Sua nota: ${userRating} de 5`}
            >
              <HiStar className="h-4 w-4 text-white" />
              <span>{userRating}</span>
            </div>
          )}

          {rating && rating !== "N/A" && (
            <div className="bg-black/50 backdrop-blur-sm text-yellow-400 font-bold text-sm px-2 py-1 rounded-full flex items-center gap-1">
              <HiStar className="h-4 w-4" />
              {rating}
            </div>
          )}
        </div>

        <div className="absolute top-2 left-2 z-20">
          <div className="bg-black/50 backdrop-blur-sm text-white font-bold text-xs px-2 py-1 rounded-full">
            {mediaType === "movie" ? "FILME" : "SÉRIE"}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
        <div className="absolute inset-0 p-4 flex flex-col justify-end text-white z-20">
          <h3 className="font-bold text-base md:text-lg drop-shadow-md transform transition-transform duration-300 group-hover:-translate-y-6">
            {title}
          </h3>
          <div className="transition-all duration-300 opacity-0 group-hover:opacity-100 transform group-hover:-translate-y-6">
            <p className="text-sm text-gray-300">{year}</p>
          </div>
        </div>
        {watched && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-green-600/90 z-30
                           h-7 flex items-center justify-center backdrop-blur-sm"
            title="Assistido"
          >
            <span className="text-white font-bold tracking-wider text-xs">
              ASSISTIDO
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
