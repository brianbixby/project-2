"use strict";

const router = require("express").Router();
const { Friend } = require("../../models");

// get all
router.get('/', async (req, res) => {
    try {
        // to do: why it sends : `user_id` AS `userId`, `friend_id` AS `FriendId`
        const data = await Friend.findAll({ attributes: ['id', 'friend_id', 'user_id'], include: { all: true } });
        res.json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json({ msg: "an error occurred: ", err });
    }
});

// get by id
router.get('/:id', async (req, res) => {
    try {
        // to do: why it sends : `user_id` AS `userId`, `friend_id` AS `FriendId`
        const data = await Friend.findByPk(req.params.id, { attributes: ['id', 'friend_id', 'user_id'], include: { all: true } });
        if (!data) {
            res.status(404).json({ message: 'No item with this id!' });
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

// post
router.post('/', async (req, res) => {
    try {
        const data = await Friend.create(req.body);
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json(err);
    }
});

// put by id
router.put('/:id', async (req, res) => {
    try {
        const data = await Friend.update(req.body, { where: { id: req.params.id } });
        if (!data[0]) {
            res.status(404).json({ message: 'No item with this id!' });
            return;
        }
        res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

//delete by id
router.delete("/:id", async (req, res) => {
    try {
        const data = await Friend.destroy({ where: { id: req.params.id } });
        if (!data[0]) {
            res.status(404).json({ message: 'No item with this id!' });
            return;
        }
        res.json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

module.exports = router;