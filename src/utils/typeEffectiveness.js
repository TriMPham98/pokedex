export const typeEffectiveness = {
  normal: { weaknesses: ["fighting"], resistances: [], immunities: ["ghost"] },
  fire: {
    weaknesses: ["water", "ground", "rock"],
    resistances: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    immunities: [],
  },
  water: {
    weaknesses: ["electric", "grass"],
    resistances: ["fire", "water", "ice", "steel"],
    immunities: [],
  },
  electric: {
    weaknesses: ["ground"],
    resistances: ["electric", "flying", "steel"],
    immunities: [],
  },
  grass: {
    weaknesses: ["fire", "ice", "poison", "flying", "bug"],
    resistances: ["water", "electric", "grass", "ground"],
    immunities: [],
  },
  ice: {
    weaknesses: ["fire", "fighting", "rock", "steel"],
    resistances: ["ice"],
    immunities: [],
  },
  fighting: {
    weaknesses: ["flying", "psychic", "fairy"],
    resistances: ["bug", "rock", "dark"],
    immunities: [],
  },
  poison: {
    weaknesses: ["ground", "psychic"],
    resistances: ["grass", "fighting", "poison", "bug", "fairy"],
    immunities: [],
  },
  ground: {
    weaknesses: ["water", "grass", "ice"],
    resistances: ["poison", "rock"],
    immunities: ["electric"],
  },
  flying: {
    weaknesses: ["electric", "ice", "rock"],
    resistances: ["grass", "fighting", "bug"],
    immunities: ["ground"],
  },
  psychic: {
    weaknesses: ["bug", "ghost", "dark"],
    resistances: ["fighting", "psychic"],
    immunities: [],
  },
  bug: {
    weaknesses: ["fire", "flying", "rock"],
    resistances: ["grass", "fighting", "ground"],
    immunities: [],
  },
  rock: {
    weaknesses: ["water", "grass", "fighting", "ground", "steel"],
    resistances: ["normal", "fire", "poison", "flying"],
    immunities: [],
  },
  ghost: {
    weaknesses: ["ghost", "dark"],
    resistances: ["poison", "bug"],
    immunities: ["normal", "fighting"],
  },
  dragon: {
    weaknesses: ["ice", "dragon", "fairy"],
    resistances: ["fire", "water", "electric", "grass"],
    immunities: [],
  },
  dark: {
    weaknesses: ["fighting", "bug", "fairy"],
    resistances: ["ghost", "dark"],
    immunities: ["psychic"],
  },
  steel: {
    weaknesses: ["fire", "fighting", "ground"],
    resistances: [
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "bug",
      "rock",
      "dragon",
      "steel",
      "fairy",
    ],
    immunities: ["poison"],
  },
  fairy: {
    weaknesses: ["poison", "steel"],
    resistances: ["fighting", "bug", "dark"],
    immunities: ["dragon"],
  },
};
