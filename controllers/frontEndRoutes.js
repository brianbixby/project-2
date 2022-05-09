"use strict";

const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get("/",(req,res)=>{
    res.render("home");
})

router.get("/games", (req, res) =>{
    if(!req.session.user){
        res.redirect('/')
        alert("Please log in or sign up!")
    }
    res.render("games")
})

router.get("/login", (req,res) =>{
    res.redirect('/')
    alert("Please log in or sign up!")
})

router.get('/gameplay', (req, res)=>{
    if(!req.session.user){
        res.redirect('/')
        alert("Please log in or sign up!")
    }
    res.render("gameplay")
})


router.get("/profile",(req,res)=>{
    if(!req.session.user){
       res.redirect("/login")
       alert("Please log in or sign up!")
    }
    User.findByPk(req.session.user.id,{
        include:[Blog]
    }).then(userData=>{
        console.log(userData);
        const hbsData = userData.get({plain:true}) 
        console.log("=======")
        console.log(hbsData);
        hbsData.loggedIn = req.session.user?true:false
        res.render("profile",hbsData)
    })
})

module.exports = router;