import React, { useState, useEffect } from "react";
import "./PokemonList.css";
import PokemonDetail from "./PokemonDetail";

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
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
            <span className="pokemon-name">{p.name}</span>
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
