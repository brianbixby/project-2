"use strict";

const Friend = require("./Friend");
const Game = require("./Game");
const GameInstance = require("./GameInstance");
const Ranking = require("./Ranking");
const User = require("./User");


Game.hasMany(GameInstance, {foreignKey: 'game_id'});
GameInstance.belongsTo(Game);

// to do creates field user_id !!!important
User.hasMany(GameInstance, {foreignKey: 'player1_id'});
GameInstance.belongsTo(User);

User.hasMany(GameInstance, {foreignKey: 'player2_id'});
GameInstance.belongsTo(User);

User.hasMany(GameInstance, {foreignKey: 'winner_id'});
GameInstance.belongsTo(User);

Game.hasMany(Ranking, {foreignKey: 'game_id'});
Ranking.belongsTo(Game);

User.hasMany(Ranking, {foreignKey: 'user_id'});
Ranking.belongsTo(User);

User.belongsToMany(User, { as: 'Friend', through: 'friend' });

module.exports = { Friend, Game, GameInstance, Ranking, User };