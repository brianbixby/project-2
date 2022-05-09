"use strict";

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Ranking extends Model {}

Ranking.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
//     game_id: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'game',
//             key: 'id',
//             unique: false,
//             allowNull: false
//         }
//     },
//     user_id: {
//         type: DataTypes.INTEGER,
//         allowNull:false,
//         references: {
//            model: 'user',
//            key: 'id',
//            unique: false,
//            allowNull: false
//          },
//    },
    rank: {
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue: 1000
    },
},{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'ranking',
});

module.exports = Ranking;