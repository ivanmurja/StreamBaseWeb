import { HiOutlineSearch } from "react-icons/hi";
import React from "react";

const SearchBar = React.forwardRef(({ value, onChange }, ref) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <HiOutlineSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Busque por um filme ou série..."
          className="w-full p-4 pl-12 text-lg bg-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary border border-gray-600 transition-all duration-300 shadow-lg focus:shadow-brand-primary/40"
        />
      </div>
    </div>
  );
});

export default SearchBar;
