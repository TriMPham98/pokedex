import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>About</h3>
            <p>
              This Pokédex application is a demo project showcasing React and
              API integration.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#top">Top</a>
              </li>
              <li>
                <a href="#pokemon-search">Pokémon Search</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Repository</h3>
            <a
              href="https://github.com/TriMPham98/pokedex"
              target="_blank"
              rel="noopener noreferrer">
              View on GitHub
            </a>
          </div>
        </div>
        <div className="copyright">
          <p>
            &copy; {new Date().getFullYear()} Pokédex App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
