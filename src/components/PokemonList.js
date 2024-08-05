import React, { useState, useEffect } from "react";
import "./PokemonList.css";
import PokemonDetail from "./PokemonDetail";

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
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (p) => {
            const res = await fetch(p.url);
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
        );

        setPokemon(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
        setIsLoading(false);
      } catch (e) {
        console.error("Error fetching Pokémon:", e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    const filtered = pokemon.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch =
        selectedType === "" ||
        p.types.some((t) => t.type.name === selectedType);
      return nameMatch && typeMatch;
    });
    setFilteredPokemon(filtered);
  }, [searchTerm, selectedType, pokemon]);

  const handlePokemonClick = (clickedPokemon) => {
    setSelectedPokemon(clickedPokemon);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  const getAnimatedSpriteUrl = (pokemon) => {
    return (
      pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated
        ?.front_default || pokemon.sprites.front_default
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  if (isLoading) {
    return <div className="loading">Loading Pokémon...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="pokemon-grid-container">
      <h2 className="pokemon-grid-title">Pokémon Grid</h2>
      <div className="pokemon-filters">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={searchTerm}
          onChange={handleSearchChange}
          className="pokemon-search"
        />
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="pokemon-type-filter">
          <option value="">All Types</option>
          {Object.keys(typeColors).map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="pokemon-grid">
        {filteredPokemon.map((p) => (
          <div
            key={p.id}
            className="pokemon-grid-item"
            onClick={() => handlePokemonClick(p)}>
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
      {selectedPokemon && (
        <PokemonDetail pokemon={selectedPokemon} onClose={handleCloseDetail} />
      )}
    </div>
  );
}

export default PokemonList;
