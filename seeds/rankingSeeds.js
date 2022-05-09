"use strict";

const { Ranking } = require('../models');

const rankingData = [
  {
    game_id: 1,
    user_id: 1,
  },
  {
    game_id: 2,
    user_id: 1,
  },

  {
    game_id: 1,
    user_id: 2,
  },
  {
    game_id: 2,
    user_id: 2,
  },

  {
    game_id: 1,
    user_id: 3,
  },
  {
    game_id: 2,
    user_id: 3,
  },

  {
    game_id: 1,
    user_id: 4,
  },
  {
    game_id: 2,
    user_id: 4,
  },

  {
    game_id: 1,
    user_id: 5,
    rank: 900,
  },
  {
    game_id: 2,
    user_id: 5,
    rank: 910,
  },
];

const seedRankings = () => Ranking.bulkCreate(rankingData);

module.exports = seedRankings;