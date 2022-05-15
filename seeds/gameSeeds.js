"use strict";

const { Game } = require('../models');

const gameData = [
    {
        name: 'Tic Tac Toe',
        description: "The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner."
    },
    {
        name: 'Connect Four',
        description: 'It’s the classic game you love to play with your friends and family. Can you connect four of your coloured disks by dropping them into the holder before your opponent does?'
    },
];

const seedGames = () => Game.bulkCreate(gameData);

module.exports = seedGames;