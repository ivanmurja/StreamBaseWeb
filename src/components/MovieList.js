import React from "react";
import MovieCard from "./MovieCard";
import { useAuth } from "../context/AuthContext";

const MovieList = ({ results, isLoading, error, query }) => {
  const { user, getMediaStatus } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-red-400">
          Oops! Algo deu errado.
        </h2>
        <p className="text-brand-text-secondary mt-2">{error}</p>
      </div>
    );
  }

  if (
    query &&
    query.trim() !== "" &&
    !isLoading &&
    (!results || results.length === 0)
  ) {
    return (
      <div className="text-center py-10 px-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-brand-text">
          Nenhum resultado encontrado
        </h2>
        <p className="text-brand-text-secondary mt-2">
          Verifique o que foi digitado e tente novamente.
        </p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    if (query && query.trim()) {
      return (
        <div className="text-center py-10 px-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-brand-text">
            Nenhum resultado encontrado
          </h2>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {results.map((result) => {
        const status = user ? getMediaStatus(result.mediaType, result.id) : {};
        return (
          <MovieCard
            key={`${result.mediaType}-${result.id}`}
            id={result.id}
            poster={result.poster}
            title={result.title}
            year={result.year}
            rating={result.rating_tmdb || result.rating}
            userRating={status.rating}
            watched={status.watched}
            mediaType={result.mediaType}
          />
        );
      })}
    </div>
  );
};

export default MovieList;
