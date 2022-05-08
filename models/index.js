"use strict";

const User = require("./User");
const FriendsList = require('./FriendsList');
const HighScore = require('./HighScore');

User.hasOne(HighScore, { foreignKey: 'highScore_id', constrains: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasOne(FriendsList, { foreignKey: 'friendsList_id', constrains: false, onDelete: 'CASCADE', onUpdate: 'CASCADE'});


HighScore.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE'});

FriendsList.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });


module.exports = { User, FriendsList, HighScore };