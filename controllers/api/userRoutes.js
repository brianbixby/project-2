"use strict";

const router = require("express").Router();
const { User, Game, Ranking } = require("../../models");

router.get('/', async (req, res) => {
  try {
    // to do get all friends
    // to do get all rankings
    const data = await User.findAll();
    res.json(data);
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json({ msg: "an error occurred: ", err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // to do get all friends
    // to do get all rankings
    const data = await User.findByPk(req.params.id);
    if (!data) {
      res.status(404).json({ message: 'No user with this id!' });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.user_name) {
      req.body.user_name = req.body.email;
    }
    const data = await User.create(req.body);
    // creates new rankings for each game
    const games = await Game.findAll({ attributes: ['id'], raw: true });
    const rankingData = games.map(game => {
      return { "game_id": game.id, "user_id": data.id };
    });
    await Ranking.bulkCreate(rankingData);
    req.session.user = { user_id: data.id, logged_in: true };
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    req.body.email = req.body.email.toLowerCase();
    const data = await User.findOne({ where: { email: req.body.email } })
    if (!data) {
      res.status(400).json({ msg: "'Incorrect email or password, please try again'" });
      return;
    }
    const validPassword = await data.checkPassword(req.body.password);
    if (validPassword) {
      req.session.user = { user_id: data.id, logged_in: true };
      res.json(data);
    } else {
      return res.status(400).json({ msg: "'Incorrect email or password, please try again'" })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "an error occured", err });
    // res.status(400).json(err);
  }
});

router.get('/logout', async (req, res) => {
  try {
    if (req.session && req.session.user && req.session.user.logged_in) {
      // updating userProfile to is_online false
      await User.update({ is_online: false }, { where: { id: req.session.user.user_id } });
      req.session.destroy(() => {
        res.status(204).redirect('/');
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await User.update(req.body, { where: { id: req.params.id } });
    if (!data[0]) {
      res.status(404).json({ message: 'No user with this id!' });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json(err);
  }
});

//delete a user
router.delete("/:id", async (req, res) => {
  try {
    const data = await User.destroy({ where: { id: req.params.id } });
    if (!data[0]) {
      res.status(404).json({ message: 'No user with this id!' });
      return;
    }
    res.json(data);
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json(err);
  }
});

module.exports = router;