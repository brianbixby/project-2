"use strict";

function c4handleTileClick(e) {
    console.log("c4handletileclick")
    if (currentState.game.currentPlayer === currentState.user.userID) {
        let mod = Number(this.getAttribute("data-cellnumber")) % 7;
        mod = mod !== 0 ? mod + 34 : 41;
        while (mod >= 0) {
            const el = document.querySelector(`#c4-${mod}`);
            if (!el.getAttribute("data-player")) {
                currentState.game.clickedTile = `c4-${mod}`;
                console.log("currentState.game: ", currentState.game);
                socket.emit("c4-playerMadeMoveServer", currentState.game);
                return;
            }
            mod -= 7;
        }
    }
}

function newC4Game() {
    console.log("new c4 game");
    const tiles = document.querySelectorAll(".c4-tile");
    const tilesArray = Array.from(tiles);
    tilesArray.forEach(tile => tile.addEventListener("click", c4handleTileClick));
    currentState.game.moveNumber = 0;
    console.log("tilesArray: ", tilesArray);
}

function chkLine(a, b, c, d) {
    return ((a) && (a == b) && (a == c) && (a == d));
}

function checkForWin() {
    console.log("checkForWin");
    const tiles = document.querySelectorAll(".c4-boardTile");
    const tilesArray = Array.from(tiles);
    const tilesData = tilesArray.reduce((acc, curr) => {
        acc.push(curr.getAttribute("data-player"));
        return acc;
    }, []);

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {
            if (chkLine(tilesData[j * 6 + i], tilesData[j * 6 + i + 1], tilesData[j * 6 + i + 2], tilesData[j * 6 + i + 3])) {
                currentState.game.winner = currentState.game.currentPlayer;
                socket.emit("c4-endGameServer", currentState.game);
                console.log("winner 1")
                return;
            }
        }
    }

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if (chkLine(tilesData[i * 7 + j], tilesData[i * 7 + j + 1], tilesData[i * 7 + j + 2], tilesData[i * 7 + j + 3])) {
                currentState.game.winner = currentState.game.currentPlayer
                socket.emit("c4-endGameServer", currentState.game);
                console.log("winner 2")
                return;
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (chkLine(tilesData[i * 7 + j], tilesData[(i + 1) * 7 + j + 1], tilesData[(i + 2) * 7 + j + 2], tilesData[(i + 3) * 7 + j + 3])) {
                currentState.game.winner = currentState.game.currentPlayer
                socket.emit("c4-endGameServer", currentState.game);
                console.log("winner 3")
                return;
            }
        }
    }

    for (let i = 3; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if (chkLine(tilesData[i * 7 + j], tilesData[(i - 1) * 7 + j + 1], tilesData[(i - 2) * 7 + j + 2], tilesData[(i - 3) * 7 + j + 3])) {
                currentState.game.winner = currentState.game.currentPlayer
                socket.emit("c4-endGameServer", currentState.game);
                console.log("winner 4")
                return;
            }
        }
    }

    if (currentState.game.moveNumber == 42) {
        if (!currentState.game.winner) {
            currentState.game.winner = "tie";
        }
        socket.emit("c4-endGameServer", currentState.game);
    }
}

if (socket) {
    socket.on("c4-startGame", data => {
        console.log("c4-startGame: ", data);
        currentState.game = data;
        newC4Game();
    });

    socket.on("c4-playerMadeMove", data => {
        console.log("c4-playerMadeMove: ", data);
        currentState.game = data;
        let clickedTileEl = document.querySelector(`#${currentState.game.clickedTile}`);
        let imgEl = document.createElement("img");
        clickedTileEl.setAttribute("class", "c4-clickedTile c4-boardTile");
        clickedTileEl.setAttribute("data-player", currentState.game.currentPlayer);
        imgEl.setAttribute("class", "c4-clickedTileImage");
        if (currentState.game.currentPlayer == currentState.game.player1) {
            imgEl.setAttribute("src", "/assets/crown.png");
        } else {
            imgEl.setAttribute("src", "/assets/dragon.png");
        }
        clickedTileEl.appendChild(imgEl);
        currentState.game.moveNumber++;
        if (currentState.game.moveNumber >= 7) {
            checkForWin();
        }
        currentState.game.currentPlayer = currentState.game.currentPlayer == currentState.game.player1 ? currentState.game.player2 : currentState.game.player1;
    });

    socket.on("c4-endGame", data => {
        console.log("c4-endGame client: ", data);
        currentState.game = data;
        if (data.winner === "tie") {
            alert("congrats on the tie!");
        } else if (data.winner == currentState.user.userID) {
            alert("congrats you won at connect 4, you must be really good at life");
        } else {
            alert("sorry you lost, would you like the # to a good therapist?");
        }
        const tiles = document.querySelectorAll(".clickedTile");
        const tilesArray = Array.from(tiles);
        tilesArray.forEach(clickedTileEl => {
            clickedTileEl.setAttribute("class", "c4-tile boardTile");
            clickedTileEl.removeAttribute("data-player");
            clickedTileEl.removeChild(clickedTileEl.children[0]);
        });
        // to do end the game ask for rematch, posts to db
    });
}