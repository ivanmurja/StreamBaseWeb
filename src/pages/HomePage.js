import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import tmdbApi from "../api/tmdb";
import HeroSection from "../components/HeroSection";
import MovieList from "../components/MovieList";

const HomePage = () => {
  const { query, setQuery, filters } = useOutletContext();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const featuredMovie = useMemo(() => {
    return results.length > 0 ? results[0] : null;
  }, [results]);

  useEffect(() => {
    const formatResults = (tmdbResults) =>
      tmdbResults
        .filter(
          (result) => result.poster_path && result.media_type !== "person"
        )
        .map((result) => ({
          id: result.id,
          title: result.title || result.name,
          poster: result.poster_path,
          backdrop_path: result.backdrop_path,
          year:
            (result.release_date || result.first_air_date)?.substring(0, 4) ||
            "N/A",
          rating: result.vote_average ? result.vote_average.toFixed(1) : "N/A",
          mediaType: result.media_type || "movie",
        }));

    const fetchMovies = async () => {
      setIsLoading(true);
      setError("");

      try {
        let response;
        if (query.trim() !== "") {
          response = await tmdbApi.get(`/search/multi`, {
            params: { query, include_adult: false },
          });
        } else {
          const params = {
            sort_by: filters.sortBy,
            "vote_average.gte": filters.rating > 0 ? filters.rating : undefined,
            with_genres: filters.genre || undefined,
            "vote_count.gte": filters.sortBy.includes("vote_average")
              ? 100
              : undefined,
          };
          response = await tmdbApi.get(`/discover/movie`, { params });
        }

        if (response.data && response.data.results.length > 0) {
          let formatted = formatResults(response.data.results);
          if (query.trim() !== "" && filters.rating > 0) {
            formatted = formatted.filter(
              (r) => parseFloat(r.rating) >= filters.rating
            );
          }
          if (query.trim() === "" && !filters.genre && filters.rating === 0) {
            formatted = formatted.slice(0, 18);
          }
          setResults(formatted);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError("Falha ao conectar com o servidor. Tente novamente.");
      }
      setIsLoading(false);
    };

    const timeoutId = setTimeout(fetchMovies, 500);
    return () => clearTimeout(timeoutId);
  }, [query, filters]);

  const getTitle = () => {
    if (query.trim() !== "") {
      return `Resultados para "${query}"`;
    }
    if (filters.genre || filters.rating > 0) {
      return "Filmes Filtrados";
    }
    return "Populares da Semana";
  };

  return (
    <>
      <HeroSection
        query={query}
        onQueryChange={setQuery}
        featuredMovie={featuredMovie}
      />
      <section className="container mx-auto p-4 md:px-8 pb-16">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-white border-b-2 border-brand-border pb-2">
            {getTitle()}
          </h3>
        </div>
        <MovieList
          results={results}
          isLoading={isLoading}
          error={error}
          query={query || filters.genre || filters.rating > 0 ? " " : ""}
        />
      </section>
    </>
  );
};

export default HomePage;
