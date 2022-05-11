"use strict";

const Friend = require("./Friend");
const Game = require("./Game");
const GameInstance = require("./GameInstance");
const Ranking = require("./Ranking");
const User = require("./User");

// to do: CASCADE onupdate and delete?
// when a user is deleted we should remove all friends and rankings for that user, but not game instances
Game.hasMany(GameInstance, { foreignKey: 'game_id', onDelete: 'CASCADE' });
GameInstance.belongsTo(Game, { foreignKey: 'game_id' });

User.hasMany(GameInstance, { foreignKey: 'player1_id', onDelete: 'SET NULL' });
GameInstance.belongsTo(User, { foreignKey: 'player1_id' });

User.hasMany(GameInstance, { foreignKey: 'player2_id', onDelete: 'SET NULL' });
GameInstance.belongsTo(User, { foreignKey: 'player2_id' });

User.hasMany(GameInstance, { foreignKey: 'loser_id', onDelete: 'SET NULL' });
GameInstance.belongsTo(User, { foreignKey: 'loser_id' });

User.hasMany(GameInstance, { foreignKey: 'winner_id', onDelete: 'SET NULL' });
GameInstance.belongsTo(User, { foreignKey: 'winner_id' });

Game.hasMany(Ranking, { foreignKey: 'game_id', onDelete: 'CASCADE' });
Ranking.belongsTo(Game, { foreignKey: 'game_id' });

User.hasMany(Ranking, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Ranking.belongsTo(User, { foreignKey: 'user_id' });

// to do checl and see if deleting a friendship will delete the user and vica versa
User.belongsToMany(User, { as: 'Friend', through: 'friend', onDelete: 'CASCADE' });

module.exports = { Friend, Game, GameInstance, Ranking, User };