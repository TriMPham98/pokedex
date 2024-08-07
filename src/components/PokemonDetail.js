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

const typeEffectiveness = {
  normal: { weaknesses: ["fighting"], resistances: [], immunities: ["ghost"] },
  fire: {
    weaknesses: ["water", "ground", "rock"],
    resistances: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    immunities: [],
  },
  water: {
    weaknesses: ["electric", "grass"],
    resistances: ["fire", "water", "ice", "steel"],
    immunities: [],
  },
  electric: {
    weaknesses: ["ground"],
    resistances: ["electric", "flying", "steel"],
    immunities: [],
  },
  grass: {
    weaknesses: ["fire", "ice", "poison", "flying", "bug"],
    resistances: ["water", "electric", "grass", "ground"],
    immunities: [],
  },
  ice: {
    weaknesses: ["fire", "fighting", "rock", "steel"],
    resistances: ["ice"],
    immunities: [],
  },
  fighting: {
    weaknesses: ["flying", "psychic", "fairy"],
    resistances: ["bug", "rock", "dark"],
    immunities: [],
  },
  poison: {
    weaknesses: ["ground", "psychic"],
    resistances: ["grass", "fighting", "poison", "bug", "fairy"],
    immunities: [],
  },
  ground: {
    weaknesses: ["water", "grass", "ice"],
    resistances: ["poison", "rock"],
    immunities: ["electric"],
  },
  flying: {
    weaknesses: ["electric", "ice", "rock"],
    resistances: ["grass", "fighting", "bug"],
    immunities: ["ground"],
  },
  psychic: {
    weaknesses: ["bug", "ghost", "dark"],
    resistances: ["fighting", "psychic"],
    immunities: [],
  },
  bug: {
    weaknesses: ["fire", "flying", "rock"],
    resistances: ["grass", "fighting", "ground"],
    immunities: [],
  },
  rock: {
    weaknesses: ["water", "grass", "fighting", "ground", "steel"],
    resistances: ["normal", "fire", "poison", "flying"],
    immunities: [],
  },
  ghost: {
    weaknesses: ["ghost", "dark"],
    resistances: ["poison", "bug"],
    immunities: ["normal", "fighting"],
  },
  dragon: {
    weaknesses: ["ice", "dragon", "fairy"],
    resistances: ["fire", "water", "electric", "grass"],
    immunities: [],
  },
  dark: {
    weaknesses: ["fighting", "bug", "fairy"],
    resistances: ["ghost", "dark"],
    immunities: ["psychic"],
  },
  steel: {
    weaknesses: ["fire", "fighting", "ground"],
    resistances: [
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "bug",
      "rock",
      "dragon",
      "steel",
      "fairy",
    ],
    immunities: ["poison"],
  },
  fairy: {
    weaknesses: ["poison", "steel"],
    resistances: ["fighting", "bug", "dark"],
    immunities: ["dragon"],
  },
};

function PokemonDetail({ pokemon, onClose }) {
  const detailRef = useRef(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [evolutionSprites, setEvolutionSprites] = useState([]);
  const [evolutionMethods, setEvolutionMethods] = useState([]);
  const [typeEffectivenessData, setTypeEffectivenessData] = useState({
    quadWeaknesses: [],
    weaknesses: [],
    resistances: [],
    quadResistances: [],
    immunities: [],
  });

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
        const methods = [];
        let currentStage = evolutionChainData.chain;

        while (currentStage) {
          chain.push(currentStage.species.name);

          if (currentStage.evolution_details.length > 0) {
            const detail = currentStage.evolution_details[0];
            let method = "";
            if (detail.min_level) {
              method = `Lv. ${detail.min_level}`;
            } else if (detail.item) {
              method = detail.item.name.replace("-", " ");
            } else if (detail.trigger) {
              method = detail.trigger.name.replace("-", " ");
            }
            methods.push(method);
          } else {
            methods.push("");
          }

          currentStage = currentStage.evolves_to[0];
        }

        setEvolutionChain(chain);
        setEvolutionMethods(methods);

        // Fetch sprites for each evolution
        const sprites = await Promise.all(
          chain.map(async (name) => {
            const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${name}`
            );
            const data = await response.json();
            return data.sprites.front_default;
          })
        );
        setEvolutionSprites(sprites);
      } catch (error) {
        console.error("Error fetching evolution chain:", error);
      }
    }

    fetchEvolutionChain();
  }, [pokemon]);

  useEffect(() => {
    function calculateTypeEffectiveness() {
      const effectiveness = {
        quadWeaknesses: [],
        weaknesses: [],
        resistances: [],
        quadResistances: [],
        immunities: [],
      };
      const effectivenessCount = {};

      pokemon.types.forEach((typeObj) => {
        const type = typeObj.type.name;
        const typeEffects = typeEffectiveness[type];

        typeEffects.weaknesses.forEach((w) => {
          effectivenessCount[w] = (effectivenessCount[w] || 0) + 1;
        });
        typeEffects.resistances.forEach((r) => {
          effectivenessCount[r] = (effectivenessCount[r] || 0) - 1;
        });
        typeEffects.immunities.forEach((i) => {
          effectivenessCount[i] = -2;
        });
      });

      Object.entries(effectivenessCount).forEach(([type, count]) => {
        if (count === 2) effectiveness.quadWeaknesses.push(type);
        else if (count === 1) effectiveness.weaknesses.push(type);
        else if (count === -1) effectiveness.resistances.push(type);
        else if (count === -2) effectiveness.quadResistances.push(type);
        else if (count <= -3) effectiveness.immunities.push(type);
      });

      setTypeEffectivenessData(effectiveness);
    }

    calculateTypeEffectiveness();
  }, [pokemon]);

  if (!pokemon) return null;

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || "#FFFFFF";
  const statColor = backgroundColor;

  const capitalize = (str) =>
    str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="pokemon-detail-overlay">
      <div
        className="pokemon-detail-content"
        ref={detailRef}
        style={{ backgroundColor: `${backgroundColor}CC` }}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 style={{ color: "#FFFFFF" }}>{pokemon.name.toUpperCase()}</h2>
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
                {capitalize(type.type.name)}
              </li>
            ))}
          </ul>
        </div>
        <div className="pokemon-type-effectiveness">
          <h3>Type Effectiveness:</h3>
          {typeEffectivenessData.quadWeaknesses.length > 0 && (
            <div className="effectiveness-group">
              <h4>Very weak against (4x damage):</h4>
              <ul>
                {typeEffectivenessData.quadWeaknesses.map((type, index) => (
                  <li key={index} style={{ backgroundColor: typeColors[type] }}>
                    {capitalize(type)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="effectiveness-group">
            <h4>Weak against (2x damage):</h4>
            <ul>
              {typeEffectivenessData.weaknesses.map((type, index) => (
                <li key={index} style={{ backgroundColor: typeColors[type] }}>
                  {capitalize(type)}
                </li>
              ))}
            </ul>
          </div>
          <div className="effectiveness-group">
            <h4>Resistant to (0.5x damage):</h4>
            <ul>
              {typeEffectivenessData.resistances.map((type, index) => (
                <li key={index} style={{ backgroundColor: typeColors[type] }}>
                  {capitalize(type)}
                </li>
              ))}
            </ul>
          </div>
          {typeEffectivenessData.quadResistances.length > 0 && (
            <div className="effectiveness-group">
              <h4>Very resistant to (0.25x damage):</h4>
              <ul>
                {typeEffectivenessData.quadResistances.map((type, index) => (
                  <li key={index} style={{ backgroundColor: typeColors[type] }}>
                    {capitalize(type)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="effectiveness-group">
            <h4>Immune to (0x damage):</h4>
            <ul>
              {typeEffectivenessData.immunities.map((type, index) => (
                <li key={index} style={{ backgroundColor: typeColors[type] }}>
                  {capitalize(type)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pokemon-abilities">
          <h3>Abilities:</h3>
          <ul>
            {pokemon.abilities.map((ability, index) => (
              <li key={index}>{capitalize(ability.ability.name)}</li>
            ))}
          </ul>
        </div>
        <div className="pokemon-stats">
          <h3>Stats:</h3>
          {pokemon.stats.map((stat, index) => (
            <div key={index} className="stat-bar-container">
              <span className="stat-name">{capitalize(stat.stat.name)}</span>
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
          <div className="evolution-chain">
            {evolutionChain.map((stage, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <div className="evolution-method">
                    {evolutionMethods[index] && `(${evolutionMethods[index]})`}
                  </div>
                )}
                <div
                  className={`evolution-stage ${
                    stage === pokemon.name ? "current-evolution" : ""
                  }`}>
                  <img
                    src={evolutionSprites[index]}
                    alt={stage}
                    className="evolution-sprite"
                  />
                  <span>{capitalize(stage)}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
