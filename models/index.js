"use strict";

const Friend = require("./Friend");
const Game = require("./Game");
const GameInstance = require("./GameInstance");
const Ranking = require("./Ranking");
const User = require("./User");


Game.hasMany(GameInstance, {foreignKey: 'game_id'});
GameInstance.belongsTo(Game);

User.hasMany(GameInstance, {foreignKey: 'player1_id'});
GameInstance.belongsTo(User, {foreignKey: 'player1_id'});

User.hasMany(GameInstance, {foreignKey: 'player2_id'});
GameInstance.belongsTo(User, {foreignKey: 'player2_id'});

User.hasMany(GameInstance, {foreignKey: 'winner_id'});
GameInstance.belongsTo(User, {foreignKey: 'winner_id'});

Game.hasMany(Ranking, {foreignKey: 'game_id'});
Ranking.belongsTo(Game);

User.hasMany(Ranking, {foreignKey: 'user_id'});
Ranking.belongsTo(User);

User.belongsToMany(User, { as: 'Friend', through: 'friend' });

module.exports = { Friend, Game, GameInstance, Ranking, User };