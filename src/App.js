import React from "react";
import PokemonList from "./components/PokemonList";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Pokédex</h1>
      <PokemonList />
      <ScrollToTop />
    </div>
  );
}

export default App;
