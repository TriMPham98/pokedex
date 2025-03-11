import React, { useState, useEffect } from "react";
import "./PokemonList.css";
import PokemonDetail from "./PokemonDetail";
import PokemonGrid from "./PokemonGrid";
import SearchBar from "./SearchBar";
import TypeFilter from "./TypeFilter";
import PokeBallLoading from "./PokeBallLoading";
import HeroSection from "./HeroSection";
import { fetchWithCache } from "../utils/apiCache";

function PokemonList() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pokemonPerPage = 50;

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithCache(
          `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=0`
        );

        const pokemonDetails = await Promise.all(
          data.results.map(async (p) => {
            return await fetchWithCache(p.url);
          })
        );

        setPokemon(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
        setIsLoading(false);
        setHasMore(data.next !== null);
      } catch (e) {
        console.error("Error fetching Pokémon:", e);
        setError(e.message);
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const loadMorePokemon = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const offset = currentPage * pokemonPerPage;
      const data = await fetchWithCache(
        `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`
      );

      const newPokemonDetails = await Promise.all(
        data.results.map(async (p) => {
          return await fetchWithCache(p.url);
        })
      );

      setPokemon((prevPokemon) => [...prevPokemon, ...newPokemonDetails]);
      setCurrentPage((prevPage) => prevPage + 1);
      setHasMore(data.next !== null);
      setIsLoadingMore(false);
    } catch (e) {
      console.error("Error fetching more Pokémon:", e);
      setError(e.message);
      setIsLoadingMore(false);
    }
  };

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
      const data = await fetchWithCache(
        `https://pokeapi.co/api/v2/pokemon/${newPokemon.name}`
      );
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
        {hasMore &&
          !isLoadingMore &&
          filteredPokemon.length === pokemon.length && (
            <div className="load-more-container">
              <button className="load-more-button" onClick={loadMorePokemon}>
                Load More Pokémon
              </button>
            </div>
          )}
        {isLoadingMore && (
          <div className="loading-more-container">
            <PokeBallLoading />
          </div>
        )}
      </div>
    </div>
  );
}

export default PokemonList;
