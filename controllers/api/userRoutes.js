"use strict";

const router = require("express").Router();
const { User } = require("../../models");

router.get('/', async (req, res) => {
  try {
    const data = await User.findAll();
    res.json(data);
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json({ msg: "an error occurred: ", err });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Model.findAll({ attributes: ['foo', 'bar']});

    // Post.findAll({
    //   where: {
    //     id: [1,2,3] // Same as using `id: { [Op.in]: [1,2,3] }`
    //   }
    // });
    const data = await User.findByPk(req.params.id);
    if (!data) {
      res.status(404).json({ message: 'No user with this id!' });
      return;
    }
    res.status(200).json(userData);
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    req.body.user_name = req.body.email;
    console.log("req.body: ", req.body);
    const data = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = data.id;
      req.session.logged_in = true;
      res.status(200).json(data);
    });
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
      req.session.save(() => {
        req.session.user_id = data.id;
        req.session.logged_in = true;
        res.json(data);
      });
    } else {
      return res.status(400).json({ msg: "'Incorrect email or password, please try again'" })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "an error occured", err });
    // res.status(400).json(err);
  }
});

router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).redirect('/');
    });
  } else {
    res.status(404).end();
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