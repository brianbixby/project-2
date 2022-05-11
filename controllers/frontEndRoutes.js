"use strict";

const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/games", (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        res.redirect(200, '/');
        alert("Please log in or sign up!");
    } else {
        res.render("games");
    }
});

router.get("/login", (req, res) => {
    res.redirect(200, '/');
    alert("Please log in or sign up!");
});

router.get('/gameplay', (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        res.redirect(200, '/');
        alert("Please log in or sign up!");
    } else {
        res.render("gameplay");
    }
});


router.get("/profile/:id" , (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.logged_in) {
        res.redirect(200, "/");
        alert("Please log in or sign up!");
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

module.exports = router;