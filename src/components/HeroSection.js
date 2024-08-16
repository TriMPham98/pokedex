import React, { useState, useEffect, useRef } from "react";
import "./HeroSection.css";

const landscapes = [{ name: "Viridian Forest", image: "viridian-forest.jpg" }];

const HeroSection = () => {
  const [currentLandscape, setCurrentLandscape] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const landscapeInterval = setInterval(() => {
      setCurrentLandscape((prev) => (prev + 1) % landscapes.length);
    }, 5000);

    return () => clearInterval(landscapeInterval);
  }, []);

  const handleScrollToPokedex = () => {
    const pokedexElement = document.getElementById("pokedex");
    if (pokedexElement) {
      pokedexElement.scrollIntoView({ behavior: "smooth" });
    }

    // Play the sound
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="hero-section-wrapper">
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${landscapes[currentLandscape].image})`,
        }}>
        <div className="hero-content">
          <h1 className="hero-title">National Pokédex</h1>
          <div className="pokedex-container">
            <img src="/pokedex.png" alt="Pokédex" className="pokedex-image" />
            <button onClick={handleScrollToPokedex} className="explore-button">
              Enter
            </button>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src="/pokemon-plink.mp3" />
    </div>
  );
};

export default HeroSection;
