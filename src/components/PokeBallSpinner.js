import React from "react";

const PokeBallSpinner = () => {
  return (
    <div className="pokeball-spinner">
      <div className="pokeball">
        <div className="pokeball-button">
          <div className="pokeball-button-inner"></div>
        </div>
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
