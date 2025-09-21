import React from "react";
import SearchBar from "./SearchBar";
import { TMDB_IMAGE_BASE_URL_ORIGINAL } from "../api/tmdb";

const HeroSection = React.forwardRef(
  ({ query, onQueryChange, featuredMovie }, ref) => {
    const backgroundUrl = featuredMovie
      ? `${TMDB_IMAGE_BASE_URL_ORIGINAL}${
          featuredMovie.backdrop_path || featuredMovie.poster
        }`
      : null;

    return (
      <section
        ref={ref}
        className="relative text-center py-20 md:py-28 px-4 overflow-hidden bg-brand-dark"
      >
        {backgroundUrl && (
          <>
            <div className="absolute inset-0 z-0">
              <img
                src={backgroundUrl}
                alt={featuredMovie.title}
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/50"></div>
            </div>
          </>
        )}

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-3">
            Seu Portal de Filmes e Séries
          </h2>
          <p className="text-lg text-brand-text-secondary drop-shadow-md mb-8 max-w-2xl mx-auto">
            Descubra, explore e organize. Tudo o que você ama assistir, em um só
            lugar.
          </p>
          <div>
            <SearchBar value={query} onChange={onQueryChange} />
          </div>
        </div>
      </section>
    );
  }
);

export default HeroSection;
