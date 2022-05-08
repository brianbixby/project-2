"use strict";

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class FriendsList extends Model { }

FriendsList.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id',
            unique: false,
            allowNull: false
        }
    }
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'friendsList',
});

module.exports = FriendsList;