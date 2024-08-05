import React, { useRef, useEffect, useState } from "react";
import "./PokemonDetail.css";

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

function PokemonDetail({ pokemon, onClose }) {
  const detailRef = useRef(null);
  const [evolutionChain, setEvolutionChain] = useState([]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (detailRef.current && !detailRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    async function fetchEvolutionChain() {
      try {
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        const evolutionChainResponse = await fetch(
          speciesData.evolution_chain.url
        );
        const evolutionChainData = await evolutionChainResponse.json();

        const chain = [];
        let currentStage = evolutionChainData.chain;

        while (currentStage) {
          chain.push(currentStage.species.name);
          currentStage = currentStage.evolves_to[0];
        }

        setEvolutionChain(chain);
      } catch (error) {
        console.error("Error fetching evolution chain:", error);
      }
    }

    fetchEvolutionChain();
  }, [pokemon]);

  if (!pokemon) return null;

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || "#FFFFFF";
  const statColor = backgroundColor; // Using main color without transparency for stat bars

  return (
    <div className="pokemon-detail-overlay">
      <div
        className="pokemon-detail-content"
        ref={detailRef}
        style={{ backgroundColor: `${backgroundColor}CC` }}>
        {" "}
        {/* Reduced transparency */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 style={{ color: "#FFFFFF" }}>{pokemon.name}</h2>{" "}
        {/* Changed to white for better contrast */}
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="pokemon-detail-image"
        />
        <div className="pokemon-info">
          <p>Height: {pokemon.height / 10} m</p>
          <p>Weight: {pokemon.weight / 10} kg</p>
          <p>Base Experience: {pokemon.base_experience}</p>
        </div>
        <div className="pokemon-types">
          <h3>Types:</h3>
          <ul>
            {pokemon.types.map((type, index) => (
              <li
                key={index}
                style={{ backgroundColor: typeColors[type.type.name] }}>
                {type.type.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="pokemon-abilities">
          <h3>Abilities:</h3>
          <ul>
            {pokemon.abilities.map((ability, index) => (
              <li key={index}>{ability.ability.name}</li>
            ))}
          </ul>
        </div>
        <div className="pokemon-stats">
          <h3>Stats:</h3>
          {pokemon.stats.map((stat, index) => (
            <div key={index} className="stat-bar-container">
              <span className="stat-name">{stat.stat.name}</span>
              <div className="stat-bar">
                <div
                  className="stat-fill"
                  style={{
                    width: `${(stat.base_stat / 255) * 100}%`,
                    backgroundColor: statColor,
                  }}>
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pokemon-evolution">
          <h3>Evolution Chain:</h3>
          <ul>
            {evolutionChain.map((stage, index) => (
              <li
                key={index}
                className={stage === pokemon.name ? "current-evolution" : ""}>
                {stage}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
