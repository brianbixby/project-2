"use strict";

const router = require("express").Router();
const { Op } = require("sequelize");
const { GameInstance, Ranking } = require("../../models");

// get all
router.get('/', async (req, res) => {
    try {
        const data = await GameInstance.findAll({ include: { all: true } });
        res.json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json({ msg: "an error occurred: ", err });
    }
});

// get by id
router.get('/:id', async (req, res) => {
    try {
        const data = await GameInstance.findByPk(req.params.id, { include: { all: true } });
        data === null ? res.status(404).json({ message: 'No gameInstance with this id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

// get all gameinstance for a game by game id
router.get('/game/:gameid', async (req, res) => {
    try {
        const data = await GameInstance.findAll({ where: { game_id: req.params.gameid }, include: { all: true } });
        data === null ? res.status(404).json({ message: 'No gameInstance with this game id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

// get all gameinstances for a user by userid
router.get('/user/:userid', async (req, res) => {
    try {
        const data = await GameInstance.findAll({ where: { [Op.or]: [{ player1_id: req.params.userid }, { player2_id: req.params.userid }] }, include: { all: true } });
        data === null ? res.status(404).json({ message: 'No gameInstance with this user id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

// post
router.post('/', async (req, res) => {
    try {
        const data = await GameInstance.create(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
});

// put by id - updates winning and losing players' ranks
router.put('/:id', async (req, res) => {
    try {
        const data = await GameInstance.update(req.body, { where: { id: req.params.id } });
        if (req.body.winner_id) {
            await Ranking.increment({ rank: 10 }, { where: { user_id: req.body.winner_id } });
        }
        if (req.body.loser_id) {
            await Ranking.increment({ rank: -10 }, { where: { user_id: req.body.loser_id } });
        }
        data[0] === 0 ? res.status(404).json({ message: 'No gameInstance with this id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

//delete by id
router.delete("/:id", async (req, res) => {
    try {
        const data = await GameInstance.destroy({ where: { id: req.params.id } });
        data === 0 ? res.status(404).json({ message: 'No gameInstance with this id!' }) : res.json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

module.exports = router;