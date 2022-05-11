"use strict";

const router = require("express").Router();
const { Ranking } = require("../../models");

// get all
router.get('/', async (req, res) => {
    try {
        const data = await Ranking.findAll({ include: { all: true } });
        res.json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json({ msg: "an error occurred: ", err });
    }
});

// get by id
router.get('/:id', async (req, res) => {
    try {
        const data = await Ranking.findByPk(req.params.id, { include: { all: true } });
        data === null ? res.status(404).json({ message: 'No ranking with this id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

// get all rankingse for a user by user id
router.get('/user/:userid', async (req, res) => {
    try {
        const data = await Ranking.findAll({ where: { user_id: req.params.userid }, include: { all: true } });
        data === null ? res.status(404).json({ message: 'No gameInstance with this game id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

// post
router.post('/', async (req, res) => {
    try {
        const data = await Ranking.create(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
});

// put by id
router.put('/:id', async (req, res) => {
    try {
        const data = await Ranking.update(req.body, { where: { id: req.params.id } });
        data[0] === 0 ? res.status(404).json({ message: 'No ranking with this id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

//delete by id
router.delete("/:id", async (req, res) => {
    try {
        const data = await Ranking.destroy({ where: { id: req.params.id } });
        data === 0 ? res.status(404).json({ message: 'No ranking with this id!' }) : res.json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

module.exports = router;