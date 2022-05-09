"use strict";

const { Game } = require('../models');

const gameData = [
  {
    name: 'Tic Tac Toe',
  },
  {
    name: 'Connect Four',
  },
];

const seedGames = () => Game.bulkCreate(gameData);

module.exports = seedGames;