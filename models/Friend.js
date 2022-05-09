"use strict";

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Friend extends Model { }

Friend.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id',
            defaultValue: null
        }
    },
    friend_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id',
            defaultValue: null
        }
    },
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'friend',
});

module.exports = Friend;