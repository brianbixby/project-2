"use strict";

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require("bcrypt")

class User extends Model {
    async checkPassword(password) {
        try {
            const data = await bcrypt.compare(password, this.password);
            console.log("checkPassword result: ", data);
            return data;
        } catch (err) {
            console.log("check password err: ", err);
            return null;
        }
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8]
        }
    },
    highScore: {

    },
    friends: {

    }
}, {
    hooks: {
        beforeCreate: async data => {
            // to do is await necessary  
            data.email = data.email.toLowerCase();
            data.password = await bcrypt.hash(data.password, 10);
            return data;
        },
        beforeUpdate: async data => {
            // to do is await necessary  
            data.email = data.email.toLowerCase();
            data.password = await bcrypt.hash(data.password, 10);
            return data;
        }
    },
    sequelize,
});

module.exports = User