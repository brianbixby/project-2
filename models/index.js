"use strict";

const Friend = require("./Friend");
const Game = require("./Game");
const GameInstance = require("./GameInstance");
const Ranking = require("./Ranking");
const User = require("./User");


Game.hasMany(GameInstance, {foreignKey: 'game_id'});
GameInstance.belongsTo(Game);

GameInstance.belongsTo(User, { as: 'player1'});
GameInstance.belongsTo(User, { as: 'player2'});
GameInstance.belongsTo(User, { as: 'winner'});

Game.hasMany(Ranking, {foreignKey: 'game_id'});
Ranking.belongsTo(Game);

User.hasMany(Ranking, {foreignKey: 'user_id'});
Ranking.belongsTo(User);

User.belongsToMany(User, { as: 'Friend', through: 'friend' });

module.exports = { Friend, Game, GameInstance, Ranking, User };