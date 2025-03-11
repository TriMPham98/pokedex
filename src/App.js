import React from "react";
import PokemonList from "./components/PokemonList";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function App() {
  return (
    <div className="App">
      <main>
        <ErrorBoundary>
          <PokemonList />
        </ErrorBoundary>
        <ScrollToTop />
      </main>
      <Footer />
    </div>
  );
}

export default App;
