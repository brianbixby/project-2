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
        // allowNull: false,
        // to do make sure that its deleted on user delete
        references: {
            model: 'user',
            key: 'id',
        }
    },
    friend_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        }
    },
}, {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'friend',
});

module.exports = Friend;