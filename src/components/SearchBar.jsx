import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between bg-white shadow-md rounded-full overflow-hidden w-full max-w-xl mx-auto mb-8 border border-gray-300 focus-within:border-blue-500 transition-all duration-300"
    >
      {/* Input field */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search blogs..."
        className="flex-1 px-5 py-3 text-gray-700 focus:outline-none text-sm sm:text-base"
      />

      {/* Separator */}
      <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>

      {/* Search button */}
      <button
        type="submit"
        className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm sm:text-base hover:opacity-90 transition-all duration-300 rounded-r-full"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
