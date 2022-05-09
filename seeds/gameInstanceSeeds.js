"use strict";

const { GameInstance } = require('../models');

const gameInstanceData = [
    {
        game_id: 1,
        player1_id: 1,
        player2_id: 2,
        winner_id: 1,
      },
      {
        game_id: 1,
        player1_id: 2,
        player2_id: 1,
        winner_id: 2,
      },
      {
        game_id: 1,
        player1_id: 3,
        player2_id: 4,
        winner_id: 3,
      },
      {
        game_id: 1,
        player1_id: 4,
        player2_id: 3,
        winner_id: 4,
      },
      {
        game_id: 2,
        player1_id: 5,
        player2_id: 4,
        winner_id: 5,
      },
      {
        game_id: 2,
        player1_id: 4,
        player2_id: 5,
        winner_id: 4,
      },
      {
        game_id: 2,
        player1_id: 3,
        player2_id: 2,
        winner_id: 2,
      },
      {
        game_id: 2,
        player1_id: 2,
        player2_id: 3,
        winner_id: 2,
      },
      {
        game_id: 2,
        player1_id: 1,
      },
];

const seedGameInstances = () => GameInstance.bulkCreate(gameInstanceData);

module.exports = seedGameInstances;