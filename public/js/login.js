"use strict";

document.querySelector("#login").addEventListener("submit", e => {
    e.preventDefault();
    console.log("successful")
    const userObj = {
        email: document.querySelector("#loginEmail").value,
        password: document.querySelector("#loginPassword").value,
    }
    console.log(userObj)
    fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify(userObj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        if (res.ok) {
            document.location.replace("/games")
        } else {
            alert("trumpet sound")
        }
    })
})

document.querySelector("#signup").addEventListener("submit", e => {
    e.preventDefault();
    console.log("hit");
    const userObj = {
        email: document.querySelector("#signupEmail").value,
        password: document.querySelector("#signupPassword").value,
    }
    console.log(userObj)
    fetch("/api/users/", {
        method: "POST",
        body: JSON.stringify(userObj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        if (res.ok) {
            document.location.replace("/gameselect")
        } else {
            alert("trumpet sound")
        }
    })
})