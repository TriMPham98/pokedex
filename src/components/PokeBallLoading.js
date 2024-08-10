import React, { useState, useEffect } from "react";

const PokeBallSpinner = () => {
  const [isWiggling, setIsWiggling] = useState(false);

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 1000);
    }, 500);

    const wiggleInterval = setInterval(() => {
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 1000);
    }, 4000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(wiggleInterval);
    };
  }, []);

  return (
    <div className="pokeball-container">
      <div className={`pokeball ${isWiggling ? "wiggle" : ""}`}>
        <div className="pokeball-button">
          <div className="pokeball-button-inner"></div>
        </div>
      </div>
      <style jsx>{`
        .pokeball-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
        }
        .pokeball {
          width: 60px;
          height: 60px;
          background-color: #fff;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          border: 3px solid #333;
        }
        .pokeball::before {
          content: "";
          position: absolute;
          background-color: #ff1a1a;
          width: 100%;
          height: 50%;
          top: 0;
          left: 0;
        }
        .pokeball::after {
          content: "";
          position: absolute;
          background-color: #333;
          width: 100%;
          height: 7px;
          top: calc(50% - 3.5px);
          left: 0;
          z-index: 2;
        }
        .pokeball-button {
          position: absolute;
          top: calc(50% - 8px);
          left: calc(50% - 8px);
          width: 16px;
          height: 16px;
          background-color: #333;
          border-radius: 50%;
          z-index: 10;
        }
        .pokeball-button-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background-color: #fff;
          border-radius: 50%;
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-15deg) translateX(-7.5px);
          }
          50% {
            transform: rotate(15deg) translateX(7.5px);
          }
          75% {
            transform: rotate(-15deg) translateX(-7.5px);
          }
        }
        .wiggle {
          animation: wiggle 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PokeBallSpinner;
