"use strict";

const { GameInstance } = require('../models');

const gameInstanceData = [
  {
    game_id: 1,
    player1_id: 1,
    player2_id: 2,
    winner_id: 1,
    loser_id: 2,
    complete: true
  },
  {
    game_id: 1,
    player1_id: 2,
    player2_id: 1,
    winner_id: 2,
    loser_id: 1,
    complete: true
  },
  {
    game_id: 1,
    player1_id: 3,
    player2_id: 4,
    winner_id: 3,
    loser_id: 4,
    complete: true
  },
  {
    game_id: 1,
    player1_id: 4,
    player2_id: 3,
    winner_id: 4,
    loser_id: 3,
    complete: true
  },
  {
    game_id: 2,
    player1_id: 5,
    player2_id: 4,
    winner_id: 5,
    loser_id: 4,
    complete: true
  },
  {
    game_id: 2,
    player1_id: 4,
    player2_id: 5,
    winner_id: 4,
    loser_id: 5,
    complete: true
  },
  {
    game_id: 2,
    player1_id: 3,
    player2_id: 2,
    winner_id: 2,
    loser_id: 3,
    complete: true
  },
  {
    game_id: 2,
    player1_id: 2,
    player2_id: 3,
    winner_id: 2,
    loser_id: 3,
    complete: true
  },
  {
    game_id: 2,
    player1_id: 1,
  },
];

const seedGameInstances = () => GameInstance.bulkCreate(gameInstanceData);

module.exports = seedGameInstances;