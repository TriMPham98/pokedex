import React, { useState, useEffect } from "react";

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then((response) => response.json())
      .then((data) => setPokemon(data.results))
      .catch((error) => console.error("Error fetching Pokémon:", error));
  }, []);

  return (
    <div>
      <h2>Pokémon List</h2>
      <ul>
        {pokemon.map((p, index) => (
          <li key={index}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PokemonList;
