"use strict";

const seedUsers = require('./userSeeds');
const seedRankings = require('./rankingSeeds');
const seedGames = require('./gameSeeds');
const seedGameInstances = require('./gameInstanceSeeds');
const seedFriends = require('./friendSeeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');

  await seedGames();
  console.log('\n----- GAMES SEEDED -----\n');

  await seedUsers();
  console.log('\n----- USERS SEEDED -----\n');

  await seedRankings();
  console.log('\n----- RANKINGS SEEDED -----\n');

  await seedGameInstances();
  console.log('\n----- GAME INSTANCES SEEDED -----\n');

  await seedFriends();
  console.log('\n----- FRIENDS SEEDED -----\n');

  process.exit(0);
};

seedAll();