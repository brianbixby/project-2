"use strict";

document.querySelector("#logoutButton").addEventListener("click", async () => {
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