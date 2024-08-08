import React, { useState } from "react";
import { typeColors } from "../utils/typeColors";
import "./PokemonGrid.css";
import PokemonDetail from "./PokemonDetail"; // Make sure to import PokemonDetail

function PokemonGrid({ pokemon }) {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getAnimatedSpriteUrl = (pokemon) => {
    return (
      pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated
        ?.front_default || pokemon.sprites.front_default
    );
  };

  const calculateScaleFactor = (height, weight) => {
    const normalizedHeight = Math.min(Math.max(height / 20, 0), 1);
    const normalizedWeight = Math.min(Math.max(weight / 1000, 0), 1);
    const baseScale = normalizedHeight * 0.7 + normalizedWeight * 0.3;
    return 0.25 + baseScale * 1.05;
  };

  const handlePokemonClick = (p, index) => {
    setSelectedPokemon(p);
    setCurrentIndex(index);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  const handleNavigation = (direction) => {
    let newIndex;
    if (direction === "prev") {
      newIndex = (currentIndex - 1 + pokemon.length) % pokemon.length;
    } else {
      newIndex = (currentIndex + 1) % pokemon.length;
    }
    setSelectedPokemon(pokemon[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <>
      <div className="pokemon-grid">
        {pokemon.map((p, index) => (
          <div
            key={p.id}
            className="pokemon-grid-item"
            onClick={() => handlePokemonClick(p, index)}>
            <img
              src={getAnimatedSpriteUrl(p)}
              alt={p.name}
              className="pokemon-image"
              style={{
                transform: `scale(${calculateScaleFactor(p.height, p.weight)})`,
              }}
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
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          onClose={handleCloseDetail}
          onEvolutionClick={(evolvedPokemon) => {
            const index = pokemon.findIndex((p) => p.id === evolvedPokemon.id);
            if (index !== -1) {
              handlePokemonClick(pokemon[index], index);
            }
          }}
          onNavigate={handleNavigation}
        />
      )}
    </>
  );
}

export default PokemonGrid;
