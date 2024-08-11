import React, { useState, useEffect } from "react";
import "./HeroSection.css";

const landscapes = [{ name: "Viridian Forest", image: "viridian-forest.jpg" }];

const flyingPokemon = [
  //   { name: "Pidgey", image: "/images/pidgey.png" },
  //   { name: "Butterfree", image: "/images/butterfree.png" }
];

const HeroSection = () => {
  const [currentLandscape, setCurrentLandscape] = useState(0);
  const [pokemonPositions, setPokemonPositions] = useState([]);

  useEffect(() => {
    const landscapeInterval = setInterval(() => {
      setCurrentLandscape((prev) => (prev + 1) % landscapes.length);
    }, 5000);

    return () => clearInterval(landscapeInterval);
  }, []);

  useEffect(() => {
    const generatePokemonPositions = () => {
      return flyingPokemon.map(() => ({
        top: Math.random() * 80 + 10,
        left: -20,
        speed: Math.random() * 2 + 1,
      }));
    };

    setPokemonPositions(generatePokemonPositions());

    const pokemonInterval = setInterval(() => {
      setPokemonPositions((prev) =>
        prev.map((pos) => ({
          ...pos,
          left: pos.left > 100 ? -20 : pos.left + pos.speed,
        }))
      );
    }, 50);

    return () => clearInterval(pokemonInterval);
  }, [currentLandscape]);

  return (
    <div className="hero-section-wrapper">
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${landscapes[currentLandscape].image})`,
        }}>
        <div className="hero-content">
          <h1>Welcome to the Pokédex</h1>
          <p>Explore the world of Pokémon</p>
        </div>
        {flyingPokemon.map((pokemon, index) => (
          <img
            key={pokemon.name}
            src={pokemon.image}
            alt={pokemon.name}
            className="flying-pokemon"
            style={{
              top: `${pokemonPositions[index]?.top}%`,
              left: `${pokemonPositions[index]?.left}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
