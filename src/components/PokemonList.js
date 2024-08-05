import React, { useState, useEffect } from "react";
import "./PokemonList.css";

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then((response) => response.json())
      .then((data) => setPokemon(data.results))
      .catch((error) => console.error("Error fetching Pokémon:", error));
  }, []);

  return (
    <div className="pokemon-list-container">
      <h2 className="pokemon-list-title">Pokémon List</h2>
      <ul className="pokemon-list">
        {pokemon.map((p, index) => (
          <li key={index} className="pokemon-list-item">
            <span className="pokemon-name">{p.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PokemonList;
