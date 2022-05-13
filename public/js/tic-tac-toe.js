"use strict";

// player1 = currentState.game.player1;
// player2 = currentState.game.player2;
// instanceID = currentState.game.instanceID;
// currentPlayer = currentState.game.currentPlayer;

function handleTileClick(e) {
    console.log(e.target);
    if (currentState.game.currentPlayer === currentState.user.userID) {
        if (e.target.classList.contains("t3-tile")) {
            currentState.game.clickedTile = e.target.id
            console.log(e.target.id);
            socket.emit("t3-playerMadeMoveServer", currentState.game);
        }
    }
}

function newT3Game() {
    const tiles = document.querySelectorAll(".t3-tile");
    tiles.forEach(tile => tile.addEventListener("click", handleTileClick));
    currentState.game.moveNumber = 0;
}

function checkForWin() {
    // const clickedTiles = document.querySelectorAll(".clickedTile");
    if (null) {
        // getAttribute("data-player")
        // there is a winner
        currentState.game.winner = currentPlayer;
        socket.emit("t3-endGameServer", currentState.game);
    } else if (currentState.game.moveNumber == 9) {
        currentState.game.winner = null;
        socket.emit("t3-endGameServer", currentState.game);
    }
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
        let clickedTileEl = document.querySelector(`#${currentState.game.clickedTile}`);
        let imgEl = document.createElement("img");
        clickedTileEl.setAttribute("class", "clickedTile");
        clickedTileEl.setAttribute("data-player", currentState.game.currentPlayer)
        imgEl.setAttribute("class", "clickedTileImage");
        if (currentState.game.currentPlayer == currentState.game.player1) {
            imgEl.setAttribute("src", "http://placekitten.com/200/200");
        } else {
            imgEl.setAttribute("src", "http://placekitten.com/300/300");
        }
        clickedTileEl.appendChild(imgEl);
        currentState.game.moveNumber++;
        if (currentState.game.moveNumber >= 5) {
            checkForWin();
        }
        currentState.game.currentPlayer = currentState.game.currentPlayer == currentState.game.player1 ? currentState.game.player2 : currentState.game.player1  
    });

    socket.on("t3-endGame", data => {
        console.log("t3-endGame client: ", data);
        currentState.game = data;
        document.getElementsByClassName("clickedTile").remove();
        // to do end the game ask for rematch, posts to db
    });
}

// currentState.user.userID