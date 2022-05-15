"use strict";

const router = require('express').Router();
const { User } = require('../models');

router.get("/", (req, res) => {
    console.log(req.session)
    if (req.session && req.session.user && req.session.user.logged_in) {
        res.redirect('/games');
    } else {
        res.render("home");
    }
});

router.get("/games", async (req, res) => {
    try {
        if (!req.session || !req.session.user || !req.session.user.logged_in) {
            console.log("Please log in or sign up!");
            res.redirect('/');
        } else {
            const userData = await User.findByPk(req.session.user.user_id, { include: { all: true } });
            const hbsData = userData.get({ plain: true });
            hbsData.loggedIn = true;
            console.log("hsbData", hbsData);
            res.render("games", hbsData);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


router.get("/profile/:id", (req, res) => {
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

router.get("/ranks/:id", (req, res) => {
    console.log(req.session)
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        console.log("Please log in or sign up!");
        res.redirect('/');
    } else {
        User.findByPk(req.params.id, { include: { all: true } })
            .then(userData => {
                const hbsData = userData.get({ plain: true })
                console.log(hbsData);
                hbsData.loggedIn = true;
                res.render("ranks", hbsData);
            })
            .catch(err => {
                console.log("err: ", err);
            })
    }
});


module.exports = router;