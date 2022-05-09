"use strict";

console.log("login linked1")
document.querySelector("#login").addEventListener("submit", e => {
    e.preventDefault();
    const userObj = {
        username: document.querySelector("#loginUsername").value,
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
            location.href = "/profile"
        } else {
            alert("trumpet sound")
        }
    })
})

// formEl.on('submit', handleFormSubmit);
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
            location.href = "/profile"
        } else {
            alert("trumpet sound")
        }
    })
})