"use strict";

const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get("/",(req,res)=>{

    res.render("home");
    // Blog.findAll().then(blogs=>{
    //     console.log(blogs)
    //     const hbsBlogs = blogs.map(blog=>blog.get({plain:true}))
    //     console.log("==========")
    //     console.log(hbsBlogs)
    //     const loggedIn = req.session.user?true:false
    //     res.render("home",{blogs:hbsBlogs,loggedIn,username:req.session.user?.username})
    // })
})

router.get("/login",(req,res)=>{
    if(req.session.user){
        return res.redirect("/profile")
    }
    res.render("login")
})

router.get("/profile", (req, res) => {
    // if (!req.session || !req.session.user || !req.session.user.logged_in) {
    //     res.redirect(200, "/");
    //     alert("Please log in or sign up!");
    // } else {
        User.findByPk(5, { include: { all: true } })
            .then(userData => {
                const hbsData = userData.get({ plain: true })
                console.log(hbsData);
                hbsData.loggedIn = true;
                res.render("profile", hbsData);
            })
            .catch(err => {
                console.log("err: ", err);
            })
    // }
})


// router.get("/profile",(req,res)=>{
//     if(!req.session.user){
//         return res.redirect("/login")
//     }
//     User.findByPk(req.session.user.id,{
//         include:[Blog]
//     }).then(userData=>{
//         console.log(userData);
//         const hbsData = userData.get({plain:true})
//         console.log("=======")
//         console.log(hbsData);
//         hbsData.loggedIn = req.session.user?true:false
//         res.render("profile",hbsData)
//     })
// })

module.exports = router;