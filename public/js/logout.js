"use strict";

const logoutButtonEl = document.querySelector("#logoutButton");

if (logoutButtonEl) {
    logoutButtonEl.addEventListener("click", async () => {
        try {
            const response = await fetch("/api/users/logout", { method: "POST" });
            if (response.status === 204) {
                document.location.replace("/");
            }
        } catch (err) {
            // to do handle error
            console.log("logout error: ", err);
        }
    })
}

const gameLogOutButtonEl = document.querySelector("#gamePlayLogout");

if (gameLogOutButtonEl) {
    gameLogOutButtonEl.addEventListener("click", async () => {
        try {
            const response = await fetch("/api/users/logout", { method: "POST" });
            if (response.status === 204) {
                document.location.replace("/");
            }
        } catch (err) {
            // to do handle error
            console.log("logout error: ", err);
        }
    })
}