"use strict";

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class GameInstance extends Model { }

GameInstance.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    // game_id: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: 'game',
    //         key: 'id',
    //         allowNull: false
    //     }
    // },
    player1_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id',
            defaultValue: null
        }
    },
    player2_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id',
            defaultValue: null
        }
    },
    winner_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id',
            defaultValue: null
        }
    }
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'gameInstance',
});

module.exports = GameInstance;