"use strict";

const router = require("express").Router();
const { Op } = require("sequelize");
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
        data === null ? res.status(404).json({ message: 'No friend with this id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

// get all friends for a user by userid
router.get('/user/:userid', async (req, res) => {
    try {
        const data = await Friend.findAll({ where: { [Op.or]: [{ friend_id: req.params.userid }, { user_id: req.params.userid }] }, include: { all: true } });
        data === null ? res.status(404).json({ message: 'No friends with this user id!' }) : res.status(200).json(data);
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
        data[0] === 0 ? res.status(404).json({ message: 'No friend with this id!' }) : res.status(200).json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

//delete by id
router.delete("/:id", async (req, res) => {
    try {
        const data = await Friend.destroy({ where: { id: req.params.id } });
        data === 0 ? res.status(404).json({ message: 'No friend with this id!' }) : res.json(data);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

//delete friendship by user both users' ids
router.delete("/:friendid/users/:userid", async (req, res) => {
    try {
        const dataFirstTry = await Friend.destroy({ where: { user_id: req.params.userid, friend_id: req.params.friendid } });
        if (dataFirstTry) {
            return res.json(dataFirstTry);
        }
        const dataSecondTry = await Friend.destroy({ where: { friend_id: req.params.userid, user_id: req.params.friendid } });
        dataSecondTry === 0 ? res.status(404).json({ message: 'No friend with this id!' }) : res.json(dataSecondTry);
    } catch (err) {
        console.log("err: ", err);
        res.status(500).json(err);
    }
});

module.exports = router;