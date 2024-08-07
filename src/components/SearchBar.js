import React from "react";
import "./SearchBar.css";

function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search Pokémon"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pokemon-search"
    />
  );
}

export default SearchBar;
