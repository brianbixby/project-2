"use strict";

const router = require('express').Router();
const { User, Game } = require('../models');

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/games", (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        res.redirect(200, '/');
        console.log("Please log in or sign up!");
    } else {
        res.render("games");
    }
});

router.get("/login", (req, res) => {
    res.redirect(200, '/');
    console.log("Please log in or sign up!");
});

router.get('/gameplay', (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        res.redirect(200, '/');
        console.log("Please log in or sign up!");
    } else {
        res.render("gameplay");
    }
});


router.get("/profile", (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        res.redirect(200, "/");
        console.log("Please log in or sign up!");
    } else {
        User.findByPk(req.session.user.id, { include: { all: true } })
            .then(userData => {
                const hbsData = userData.get({ plain: true })
                console.log(hbsData);
                hbsData.loggedIn = true;
                res.render("profile", hbsData);
            })
            .catch(err => {
                console.log("err: ", err);
            })
    }
})

router.get('/gamescontainer', async (req, res) => {
    try {
        if (!req.session || !req.session.user || !req.session.user.logged_in) {
            res.redirect(200, "/");
        } else {
            const data = await Game.findAll({ include: { all: true } });
            const games = data.map(game => game.get({ plain: true }));
            games.readyToPlay = false
            games.userId = req.session.user.id;
            res.render('gamesContainer', { games });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;