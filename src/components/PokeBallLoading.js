import React, { useState, useEffect } from "react";

const PokeBallLoading = () => {
  const [isWiggling, setIsWiggling] = useState(false);

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 1000);
    }, 100);

    const wiggleInterval = setInterval(() => {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 1000);
    }, 1500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(wiggleInterval);
    };
  }, []);

  const styles = {
    pokeballContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100px",
    },
    pokeball: {
      width: "60px",
      height: "60px",
      backgroundColor: "#fff",
      borderRadius: "50%",
      position: "relative",
      overflow: "hidden",
      border: "3px solid #333",
    },
    pokeballTop: {
      content: '""',
      position: "absolute",
      backgroundColor: "#ff1a1a",
      width: "100%",
      height: "50%",
      top: 0,
      left: 0,
    },
    pokeballMiddle: {
      content: '""',
      position: "absolute",
      backgroundColor: "#333",
      width: "100%",
      height: "7px",
      top: "calc(50% - 3.5px)",
      left: 0,
      zIndex: 2,
    },
    pokeballButton: {
      position: "absolute",
      top: "calc(50% - 8px)",
      left: "calc(50% - 8px)",
      width: "16px",
      height: "16px",
      backgroundColor: "#333",
      borderRadius: "50%",
      zIndex: 10,
    },
    pokeballButtonInner: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "10px",
      height: "10px",
      backgroundColor: "#fff",
      borderRadius: "50%",
    },
    wiggle: {
      animation: "wiggle 1s ease-in-out",
    },
  };

  return (
    <div style={styles.pokeballContainer}>
      <div style={{ ...styles.pokeball, ...(isWiggling ? styles.wiggle : {}) }}>
        <div style={styles.pokeballTop}></div>
        <div style={styles.pokeballMiddle}></div>
        <div style={styles.pokeballButton}>
          <div style={styles.pokeballButtonInner}></div>
        </div>
      </div>
      <style>
        {`
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-15deg) translateX(-7.5px); }
            50% { transform: rotate(15deg) translateX(7.5px); }
            75% { transform: rotate(-15deg) translateX(-7.5px); }
          }
        `}
      </style>
    </div>
  );
};

export default PokeBallLoading;
