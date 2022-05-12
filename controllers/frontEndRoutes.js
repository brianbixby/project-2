"use strict";

const router = require('express').Router();
const { User, Game } = require('../models');

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/games", (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        console.log("Please log in or sign up!");
        res.redirect('/');
    } else {
        res.render("games");
    }
});

router.get('/gameplay', (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        console.log("Please log in or sign up!");
        res.redirect('/');
    } else {
        res.render("gameplay");
    }
});


router.get("/profile/:id" , (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        console.log("Please log in or sign up!");
        res.redirect('/');
    } else {
        User.findByPk(req.params.id, { include: { all: true } })
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
            console.log("Please log in or sign up!");

            res.redirect('/');
        } else {
            const data = await Game.findAll({ include: { all: true } });
            const games = data.map(game => {
                const plainGame = game.get({ plain: true });
                plainGame.userid = req.session.user.user_id;
                return plainGame;
            });

            res.render('gamesContainer', { games });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get("/profile", (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        console.log("Please log in or sign up!");
        res.redirect('/');
    } else {
        res.render("profile");
    }
});

module.exports = router;