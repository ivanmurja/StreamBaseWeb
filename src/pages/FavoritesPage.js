import React, { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MovieList from "../components/MovieList";

const FavoritesPage = () => {
  const { user, getFavorites } = useAuth();
  const { filters } = useOutletContext();
  const favorites = getFavorites();

  const filteredFavorites = useMemo(() => {
    if (!Array.isArray(favorites)) return [];

    return favorites.filter((fav) => {
      const ratingMatch =
        filters.rating > 0
          ? parseFloat(fav.rating_tmdb || fav.rating || 0) >= filters.rating
          : true;
      const genreMatch = filters.genre
        ? fav.genres?.some((g) => g.id.toString() === filters.genre)
        : true;
      return ratingMatch && genreMatch;
    });
  }, [favorites, filters]);

  if (!user) {
    return (
      <div className="text-center py-20 px-4 animate-fade-in">
        <h2 className="text-3xl font-bold text-white">Acesso Negado</h2>
        <p className="text-brand-text-secondary mt-2 mb-6">
          Você precisa estar logado para ver seus favoritos.
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
          Meus Favoritos
        </h2>
      </div>

      {favorites.length > 0 ? (
        <MovieList
          results={filteredFavorites}
          isLoading={false}
          error={null}
          query={filters.genre || filters.rating > 0 ? " " : ""}
        />
      ) : (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-white">
            Você ainda não tem favoritos
          </h3>
          <p className="text-brand-text-secondary mt-2">
            Explore e adicione filmes e séries para vê-los aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
