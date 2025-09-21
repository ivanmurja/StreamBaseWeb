import React, { useState, useEffect } from "react";
import { HiOutlineAdjustments, HiOutlineX } from "react-icons/hi";

const Filters = ({ filters, onFilterChange, genres }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleRatingChange = (newRating) => {
    onFilterChange({ ...filters, rating: newRating });
  };

  const handleClearFilters = () => {
    onFilterChange({
      sortBy: "popularity.desc",
      genre: "",
      rating: 0,
    });
    setIsOpen(false);
  };

  const sortOptions = [
    { label: "Popularidade", value: "popularity.desc" },
    { label: "Nota", value: "vote_average.desc" },
    { label: "Data de Lançamento", value: "release_date.desc" },
    { label: "Título (A-Z)", value: "original_title.asc" },
  ];

  const ratingOptions = [7, 8, 9];

  const activeFilterCount =
    (filters.genre ? 1 : 0) + (filters.rating > 0 ? 1 : 0);

  const ratingFilterUI = (
    <div>
      <label className="block text-sm font-bold text-gray-400 mb-2">
        Nota Mínima
      </label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleRatingChange(0)}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            filters.rating === 0
              ? "bg-brand-primary text-white"
              : "bg-brand-dark text-gray-300 hover:bg-brand-border"
          }`}
        >
          Todas
        </button>
        {ratingOptions.map((rate) => (
          <button
            key={rate}
            onClick={() => handleRatingChange(rate)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              filters.rating === rate
                ? "bg-brand-primary text-white"
                : "bg-brand-dark text-gray-300 hover:bg-brand-border"
            }`}
          >
            {rate}+
          </button>
        ))}
      </div>
    </div>
  );

  const mobileFilterPanel = (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-bold text-white">Filtros</h4>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <HiOutlineX size={24} />
        </button>
      </div>
      <div>
        <label
          htmlFor="sortByMobile"
          className="block text-sm font-bold text-gray-400 mb-2"
        >
          Ordenar por
        </label>
        <select
          id="sortByMobile"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleInputChange}
          className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="genreMobile"
          className="block text-sm font-bold text-gray-400 mb-2"
        >
          Gênero
        </label>
        <select
          id="genreMobile"
          name="genre"
          value={filters.genre}
          onChange={handleInputChange}
          className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <option value="">Todos</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {ratingFilterUI}

      {activeFilterCount > 0 && (
        <button
          onClick={handleClearFilters}
          className="w-full p-3 bg-red-600/20 text-red-400 font-bold rounded-md hover:bg-red-600/30 transition-colors"
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-8 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 p-3 bg-brand-light-dark border border-brand-border rounded-md text-white font-semibold"
        >
          <HiOutlineAdjustments size={20} />
          <span>Filtros</span>
          {activeFilterCount > 0 && (
            <span className="bg-brand-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 animate-fade-in md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 bg-brand-dark rounded-t-2xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {mobileFilterPanel}
          </div>
        </div>
      )}

      <div className="hidden md:grid md:grid-cols-4 md:gap-x-6 md:items-end bg-brand-light-dark p-6 rounded-xl mb-8">
        <div>
          <label
            htmlFor="sortBy"
            className="block text-sm font-bold text-gray-400 mb-2"
          >
            Ordenar por
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleInputChange}
            className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="genre"
            className="block text-sm font-bold text-gray-400 mb-2"
          >
            Gênero
          </label>
          <select
            id="genre"
            name="genre"
            value={filters.genre}
            onChange={handleInputChange}
            className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="">Todos</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {ratingFilterUI}

        <div className="h-full flex items-end">
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="w-full p-3 bg-red-600/20 text-red-400 font-bold rounded-md hover:bg-red-600/30 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Filters;
