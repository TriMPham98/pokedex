import React, { useState, useEffect } from "react";
import "./PokemonList.css";
import PokemonDetail from "./PokemonDetail";
import PokemonGrid from "./PokemonGrid";
import SearchBar from "./SearchBar";
import TypeFilter from "./TypeFilter";
import PokeBallLoading from "./PokeBallLoading";
import HeroSection from "./HeroSection";

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
          "https://pokeapi.co/api/v2/pokemon?limit=649"
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

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handleEvolutionClick = async (newPokemon) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${newPokemon.name}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error("Error fetching evolved Pokémon data:", error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <PokeBallLoading />
      </div>
    );
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="pokemon-list-container">
      <HeroSection />
      <div id="pokedex" className="pokemon-grid-container">
        <div id="pokemon-search" className="pokemon-filters">
          <SearchBar value={searchTerm} onChange={handleSearchChange} />
          <TypeFilter value={selectedType} onChange={handleTypeChange} />
        </div>
        <PokemonGrid
          pokemon={filteredPokemon}
          onPokemonClick={handlePokemonClick}
        />
        {selectedPokemon && (
          <PokemonDetail
            pokemon={selectedPokemon}
            onClose={handleCloseDetail}
            onEvolutionClick={handleEvolutionClick}
          />
        )}
      </div>
    </div>
  );
}

export default PokemonList;
