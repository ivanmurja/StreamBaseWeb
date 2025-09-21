import React from "react";
import { HiOutlineX } from "react-icons/hi";

const FilterSidebar = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  genres,
}) => {
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

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-brand-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold text-white">Filtros</h4>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <HiOutlineX size={24} />
            </button>
          </div>

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
              className="w-full p-3 bg-brand-light-dark border border-brand-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
              className="w-full p-3 bg-brand-light-dark border border-brand-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Todos</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2">
              Nota Mínima
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRatingChange(0)}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
                  filters.rating === 0
                    ? "bg-brand-primary text-white"
                    : "bg-brand-light-dark text-gray-300 hover:bg-brand-border"
                }`}
              >
                Todas
              </button>
              {ratingOptions.map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRatingChange(rate)}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
                    filters.rating === rate
                      ? "bg-brand-primary text-white"
                      : "bg-brand-light-dark text-gray-300 hover:bg-brand-border"
                  }`}
                >
                  {rate}+
                </button>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="w-full p-3 bg-red-600/20 text-red-400 font-bold rounded-md hover:bg-red-600/30 transition-colors"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
