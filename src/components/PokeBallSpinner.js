import React from "react";

const PokeBallSpinner = () => {
  return (
    <div className="pokeball-spinner">
      <div className="pokeball">
        <div className="pokeball-button"></div>
      </div>
      <style jsx>{`
        .pokeball-spinner {
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
          animation: spin 1s linear infinite;
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
        .pokeball-button {
          position: absolute;
          top: calc(50% - 5px);
          left: calc(50% - 5px);
          width: 10px;
          height: 10px;
          background-color: #333;
          border-radius: 50%;
          z-index: 10;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PokeBallSpinner;
