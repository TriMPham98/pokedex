import React, { useState, useEffect } from "react";
import "./PokemonList.css";
import PokemonDetail from "./PokemonDetail";

// Define type colors
const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1024")
      .then((response) => response.json())
      .then((data) => {
        const fetchDetailedData = data.results.map((p) =>
          fetch(p.url).then((res) => res.json())
        );
        Promise.all(fetchDetailedData).then((detailedPokemon) => {
          setPokemon(detailedPokemon);
        });
      })
      .catch((error) => console.error("Error fetching Pokémon:", error));
  }, []);

  const handlePokemonClick = (clickedPokemon) => {
    setSelectedPokemon(clickedPokemon);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="pokemon-grid-container">
      <h2 className="pokemon-grid-title">Pokémon Grid</h2>
      <div className="pokemon-grid">
        {pokemon.map((p) => (
          <div
            key={p.id}
            className="pokemon-grid-item"
            onClick={() => handlePokemonClick(p)}>
            <img
              src={p.sprites.front_default}
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
      {selectedPokemon && (
        <PokemonDetail pokemon={selectedPokemon} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default PokemonList;
