"use strict";

function newT3Game() {

}

if (socket) {
    socket.on("t3-startGame", data => {
        console.log("t3-startGame client: ", data);
        currentState.game = data;
        newT3Game();
    });

    socket.on("t3-playerMadeMove", data => {
        console.log("t3-playerMadeMove client: ", data);
        currentState.game = data;
    });

    socket.on("t3-endGame", data => {
        console.log("t3-endGame client: ", data);
        currentState.game = data;
        // to do end the game ask for rematch, posts to db
    });
}

// currentState.user.userID