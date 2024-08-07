import React from "react";
import { typeColors } from "../utils/typeColors";
import "./PokemonGrid.css";

function PokemonGrid({ pokemon, onPokemonClick }) {
  const getAnimatedSpriteUrl = (pokemon) => {
    return (
      pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated
        ?.front_default || pokemon.sprites.front_default
    );
  };

  return (
    <div className="pokemon-grid">
      {pokemon.map((p) => (
        <div
          key={p.id}
          className="pokemon-grid-item"
          onClick={() => onPokemonClick(p)}>
          <img
            src={getAnimatedSpriteUrl(p)}
            alt={p.name}
            className="pokemon-image"
          />
          <span className="pokemon-number">
            #{p.id.toString().padStart(3, "0")}
          </span>
          <span className="pokemon-name">{p.name}</span>
          <div className="pokemon-types">
            {p.types.map((type) => (
              <span
                key={type.type.name}
                className="pokemon-type"
                style={{ backgroundColor: typeColors[type.type.name] }}>
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PokemonGrid;
