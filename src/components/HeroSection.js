import React, { useState, useEffect, useRef } from "react";
import "./HeroSection.css";

const landscapes = [{ name: "Viridian Forest", image: "viridian-forest.jpg" }];

const HeroSection = () => {
  const [currentLandscape, setCurrentLandscape] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef(null);
  const heroRef = useRef(null);
  const backgroundRef = useRef(null);
  const pokedexRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const landscapeInterval = setInterval(() => {
      setCurrentLandscape((prev) => (prev + 1) % landscapes.length);
    }, 5000);

    return () => clearInterval(landscapeInterval);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      if (!heroRef.current || !pokedexRef.current || !backgroundRef.current)
        return;

      const { clientX, clientY } = e;
      const { width, height } = heroRef.current.getBoundingClientRect();

      const xPercentage = (clientX / width - 0.5) * 2; // -1 to 1
      const yPercentage = (clientY / height - 0.5) * 2; // -1 to 1

      // Parallax effect for the Pokédex image (moves more)
      pokedexRef.current.style.transform = `translate(${xPercentage * 25}px, ${
        yPercentage * 25
      }px)`;

      // Parallax effect for the background (moves less)
      backgroundRef.current.style.transform = `translate(${
        xPercentage * -15
      }px, ${yPercentage * -15}px) scale(1.1)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile]);

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
    <div
      className={`hero-section-wrapper ${isMobile ? "mobile" : ""}`}
      ref={heroRef}>
      <div
        ref={backgroundRef}
        className="hero-background"
        style={{
          backgroundImage: `url(${landscapes[currentLandscape].image})`,
        }}
      />
      <div className="hero-content">
        <div className="hero-center-group">
          <h1 className="hero-title">National Pokédex</h1>
          <div className="pokedex-container">
            <img
              ref={pokedexRef}
              src="/pokedex.png"
              alt="Pokédex"
              className="pokedex-image"
            />
          </div>
          <button onClick={handleScrollToPokedex} className="explore-button">
            Enter
          </button>
        </div>
      </div>
      <audio ref={audioRef} src="/pokemon-plink.mp3" />
    </div>
  );
};

export default HeroSection;
