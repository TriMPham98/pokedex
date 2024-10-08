import React, { useRef, useEffect, useState, useCallback } from "react";
import { typeColors } from "../utils/typeColors";
import "./PokemonDetail.css";
import { typeEffectiveness } from "../utils/typeEffectiveness";
import PokeBallLoading from "./PokeBallLoading";

function PokemonDetail({ pokemon, onClose, onEvolutionClick, onNavigate }) {
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
  const [abilityDescriptions, setAbilityDescriptions] = useState({});
  const [audio, setAudio] = useState(null);
  const [isEvolutionLoading, setIsEvolutionLoading] = useState(true);

  const handleNavigation = useCallback(
    (direction) => {
      onNavigate(direction);
    },
    [onNavigate]
  );

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handleNavigation("prev");
          break;
        case "ArrowRight":
          handleNavigation("next");
          break;
        default:
          break;
      }
    },
    [onClose, handleNavigation]
  );

  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    async function fetchEvolutionChain() {
      setIsEvolutionLoading(true);
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
      } finally {
        setIsEvolutionLoading(false);
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

      Object.keys(typeColors).forEach((type) => {
        effectivenessCount[type] = 0;
      });

      pokemon.types.forEach((typeObj) => {
        const type = typeObj.type.name;
        const typeEffects = typeEffectiveness[type];

        typeEffects.weaknesses.forEach((w) => {
          effectivenessCount[w] += 1;
        });
        typeEffects.resistances.forEach((r) => {
          effectivenessCount[r] -= 1;
        });
        typeEffects.immunities.forEach((i) => {
          effectivenessCount[i] = -99;
        });
      });

      Object.entries(effectivenessCount).forEach(([type, count]) => {
        if (count === 2) effectiveness.quadWeaknesses.push(type);
        else if (count === 1) effectiveness.weaknesses.push(type);
        else if (count === -1) effectiveness.resistances.push(type);
        else if (count === -2) effectiveness.quadResistances.push(type);
        else if (count <= -99) effectiveness.immunities.push(type);
      });

      setTypeEffectivenessData(effectiveness);
    }

    calculateTypeEffectiveness();
  }, [pokemon]);

  useEffect(() => {
    async function fetchAbilityDescriptions() {
      const descriptions = {};
      for (const ability of pokemon.abilities) {
        try {
          const response = await fetch(ability.ability.url);
          const data = await response.json();
          const englishEntry = data.effect_entries.find(
            (entry) => entry.language.name === "en"
          );
          descriptions[ability.ability.name] = englishEntry
            ? englishEntry.effect
            : "No description available.";
        } catch (error) {
          console.error(`Error fetching ability description:`, error);
          descriptions[ability.ability.name] = "Failed to load description.";
        }
      }
      setAbilityDescriptions(descriptions);
    }

    fetchAbilityDescriptions();
  }, [pokemon]);

  useEffect(() => {
    async function playPokemonCry() {
      if (pokemon && pokemon.cries) {
        try {
          const audioElement = new Audio(pokemon.cries.latest);
          audioElement.volume = 0.25;
          setAudio(audioElement);
          audioElement
            .play()
            .catch((error) => console.error("Error playing sound:", error));
        } catch (error) {
          console.error("Error playing Pokémon cry:", error);
        }
      }
    }

    playPokemonCry();

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [pokemon]);

  const handleEvolutionClick = async (pokemonName) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const data = await response.json();
      onEvolutionClick(data);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  if (!pokemon) return null;

  const mainType = pokemon.types[0].type.name;
  const backgroundColor = typeColors[mainType] || "#FFFFFF";
  const statColor = backgroundColor;

  const capitalize = (str) =>
    str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const typeEffectivenessTable = [
    { title: "Very weak against (4x damage)", key: "quadWeaknesses" },
    { title: "Weak against (2x damage)", key: "weaknesses" },
    { title: "Resistant to (0.5x damage)", key: "resistances" },
    { title: "Very resistant to (0.25x damage)", key: "quadResistances" },
    { title: "Immune to (0x damage)", key: "immunities" },
  ];

  return (
    <div className="pokemon-detail-overlay" onClick={handleOverlayClick}>
      <div
        className="pokemon-detail-content"
        ref={detailRef}
        style={{ backgroundColor: `${backgroundColor}CC` }}
        onClick={(e) => e.stopPropagation()}>
        <button
          className="close-button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}>
          &times;
        </button>
        <div className="custom-scrollbar">
          <div className="pokemon-header">
            <h2>{pokemon.name.toUpperCase()}</h2>
            <div className="pokemon-types">
              {pokemon.types.map((type, index) => (
                <span
                  key={index}
                  className="type-pill"
                  style={{ backgroundColor: typeColors[type.type.name] }}>
                  {capitalize(type.type.name)}
                </span>
              ))}
            </div>
          </div>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="pokemon-detail-image"
          />
          <div className="pokemon-info">
            <p>
              Height: {pokemon.height / 10} m | Weight: {pokemon.weight / 10} kg
              | Base Exp: {pokemon.base_experience}
            </p>
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
            {isEvolutionLoading ? (
              <PokeBallLoading />
            ) : (
              <div className="evolution-chain">
                {evolutionChain.map((stage, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <div className="evolution-method">
                        {evolutionMethods[index] &&
                          `(${evolutionMethods[index]})`}
                      </div>
                    )}
                    <div
                      className={`evolution-stage ${
                        stage === pokemon.name ? "current-evolution" : ""
                      }`}
                      onClick={() => handleEvolutionClick(stage)}>
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
            )}
          </div>
          <div className="pokemon-type-effectiveness">
            <h3>Type Effectiveness:</h3>
            <table className="type-effectiveness-table">
              <thead>
                <tr>
                  <th>Effectiveness</th>
                  <th>Types</th>
                </tr>
              </thead>
              <tbody>
                {typeEffectivenessTable.map(({ title, key }) => (
                  <tr key={key}>
                    <td>{title}</td>
                    <td>
                      {typeEffectivenessData[key].length > 0 ? (
                        typeEffectivenessData[key].map((type, index) => (
                          <span
                            key={index}
                            className="type-pill"
                            style={{ backgroundColor: typeColors[type] }}>
                            {capitalize(type)}
                          </span>
                        ))
                      ) : (
                        <em>None</em>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pokemon-abilities">
            <h3>Abilities:</h3>
            <table className="abilities-table">
              <thead>
                <tr>
                  <th>Ability</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {pokemon.abilities.map((ability, index) => (
                  <tr key={index}>
                    <td>{capitalize(ability.ability.name)}</td>
                    <td>{abilityDescriptions[ability.ability.name]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
