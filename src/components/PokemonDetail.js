import React, { useRef, useEffect } from "react";
import "./PokemonDetail.css";

function PokemonDetail({ pokemon, onClose }) {
  const detailRef = useRef(null);

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

  if (!pokemon) return null;

  return (
    <div className="pokemon-detail-overlay">
      <div className="pokemon-detail-content" ref={detailRef}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{pokemon.name}</h2>
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
              <li key={index}>{type.type.name}</li>
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
      </div>
    </div>
  );
}

export default PokemonDetail;
