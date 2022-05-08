"use strict";

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class HighScore extends Model {}

HighScore.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    gameName: {
        type:DataTypes.STRING,
        allowNull:false
    },
    score: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
           model: 'user',
           key: 'id',
           unique: false,
           allowNull: false
         },
   },
},{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'highScore',
});

module.exports = HighScore;