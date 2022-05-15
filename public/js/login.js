"use strict";

const loginEl = document.querySelector("#login");

if (loginEl) {
    loginEl.addEventListener("submit", async (e) => {
        try {
            e.preventDefault();
            const userObj = { 
                email: document.querySelector("#loginEmail").value, 
                password: document.querySelector("#loginPassword").value };
            const data = await fetch("/api/users/login", { 
                method: "POST", 
                body: JSON.stringify(userObj), 
                headers: { "Content-Type": "application/json" } });
            if (data.ok) {
                    location.href="/games"
            }
        }
        catch (err) {
            console.log("error: ", err);
        }
    });
}

const signupEl = document.querySelector("#signup");

if (signupEl) {
    signupEl.addEventListener("submit", async (e) => {
        try {
            e.preventDefault();
            const userObj = { email: document.querySelector("#signupEmail").value, password: document.querySelector("#signupPassword").value };
            const data = await fetch("/api/users/", { method: "POST", body: JSON.stringify(userObj), headers: { "Content-Type": "application/json" }});
            if (data.ok) {
                location.href="/games";
            }
        } catch (err) {
            console.log("error: ", err);
        }
    });
}