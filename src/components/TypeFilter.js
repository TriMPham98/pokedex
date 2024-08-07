import React from "react";
import { typeColors } from "../utils/typeColors";
import "./TypeFilter.css";

function TypeFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pokemon-type-filter">
      <option value="">All Types</option>
      {Object.keys(typeColors).map((type) => (
        <option key={type} value={type}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </option>
      ))}
    </select>
  );
}

export default TypeFilter;
