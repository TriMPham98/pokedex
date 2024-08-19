import React from "react";
import PokemonList from "./components/PokemonList";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <main>
        <PokemonList />
        <ScrollToTop />
      </main>
      <Footer />
    </div>
  );
}

export default App;
