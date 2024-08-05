import React from "react";
import "./PokemonDetail.css";

function PokemonDetail({ pokemon, onClose }) {
  if (!pokemon) return null;

  return (
    <div className="pokemon-detail-overlay">
      <div className="pokemon-detail-content">
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
