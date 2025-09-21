import React from "react";
import MovieCard from "./MovieCard";
import { TMDB_IMAGE_BASE_URL } from "../api/tmdb";

const Recommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  const limitedRecommendations = recommendations.slice(0, 15);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white border-b-2 border-brand-border pb-2 mb-4">
        Recomendações
      </h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 md:space-x-0">
        {limitedRecommendations.map((item) => (
          <div key={item.id} className="w-40 flex-shrink-0 sm:w-48 md:w-auto">
            <MovieCard
              id={item.id}
              poster={
                item.poster_path
                  ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
                  : null
              }
              title={item.title || item.name}
              year={(item.release_date || item.first_air_date)?.substring(0, 4)}
              rating={item.vote_average.toFixed(1)}
              mediaType={item.media_type || "movie"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
