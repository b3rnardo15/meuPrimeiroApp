const express = require("express");
const app = express();
const port = 3001; // Usar porta diferente da API anterior para evitar conflitos

// Middleware para parsear JSON (embora não seja usado para GET, é boa prática)
app.use(express.json());

// Dados estáticos dos Pokémon
const pokemonData = {
  pikachu: {
    name: "Pikachu",
    type: "Electric",
    attacks: ["Thunder Shock", "Quick Attack", "Iron Tail", "Thunderbolt"],
    weaknesses: ["Ground"],
  },
  charmander: {
    name: "Charmander",
    type: "Fire",
    attacks: ["Scratch", "Ember", "Smokescreen", "Fire Fang"],
    weaknesses: ["Water", "Ground", "Rock"],
  },
  bulbasaur: {
    name: "Bulbasaur",
    type: "Grass/Poison",
    attacks: ["Tackle", "Vine Whip", "Leech Seed", "Razor Leaf"],
    weaknesses: ["Fire", "Flying", "Psychic", "Ice"],
  },
  squirtle: {
    name: "Squirtle",
    type: "Water",
    attacks: ["Tackle", "Water Gun", "Withdraw", "Bubble Beam"],
    weaknesses: ["Grass", "Electric"],
  },
};

// Rota GET para listar todos os Pokémon (apenas nomes)
app.get("/pokemon", (req, res) => {
  const pokemonNames = Object.keys(pokemonData).map(key => pokemonData[key].name);
  res.json(pokemonNames);
});

// Rota GET para obter dados de um Pokémon específico (pelo nome, case-insensitive)
app.get("/pokemon/:name", (req, res) => {
  const pokemonName = req.params.name.toLowerCase();
  const pokemon = pokemonData[pokemonName];

  if (pokemon) {
    console.log(`Dados solicitados para: ${pokemon.name}`);
    res.json(pokemon);
  } else {
    res.status(404).json({ error: "Pokémon não encontrado" });
  }
});

// Inicia o servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`API de Pokémon rodando em http://0.0.0.0:${port}`);
});

