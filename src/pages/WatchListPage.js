import React, { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";

const WatchlistPage = () => {
  const { user, getWatchlist } = useAuth();
  const { filters } = useOutletContext();
  const watchlist = getWatchlist();

  const filteredWatchlist = useMemo(() => {
    if (!watchlist) return [];
    return watchlist.filter((item) => {
      const ratingMatch =
        filters.rating > 0
          ? parseFloat(item.rating_tmdb) >= filters.rating
          : true;
      const genreMatch = filters.genre
        ? item.genres?.some((g) => g.id.toString() === filters.genre)
        : true;
      return ratingMatch && genreMatch;
    });
  }, [watchlist, filters]);

  if (!user) {
    return (
      <div className="text-center py-20 px-4 animate-fade-in">
        <h2 className="text-3xl font-bold text-white">Acesso Negado</h2>
        <p className="text-brand-text-secondary mt-2 mb-6">
          Você precisa estar logado para ver sua lista.
        </p>
        <Link
          to="/login"
          className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors"
        >
          Ir para Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:px-8 pb-16 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white border-b-2 border-brand-border pb-2">
          Minha Lista para Assistir
        </h2>
      </div>

      {watchlist.length > 0 ? (
        filteredWatchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filteredWatchlist.map((item) => (
              <MovieCard
                key={`${item.mediaType}-${item.id}`}
                id={item.id}
                poster={item.poster}
                title={item.title}
                year={item.year}
                rating={item.rating_tmdb}
                userRating={item.rating}
                watched={item.watched}
                mediaType={item.mediaType}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-white">
              Nenhum item encontrado
            </h3>
            <p className="text-brand-text-secondary mt-2">
              Ajuste os filtros para encontrar o que procura na sua lista.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-white">Sua lista está vazia</h3>
          <p className="text-brand-text-secondary mt-2">
            Adicione filmes e séries que você quer assistir.
          </p>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
