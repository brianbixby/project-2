"use strict";

function handleTileClick(e) {
    console.log(e.target);
    if (currentState.game.currentPlayer === currentState.user.userID) {
        if (e.target.classList.contains("t3-tile")) {
            currentState.game.clickedTile = e.target.id
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
    const tiles = document.querySelectorAll(".boardTile");
    const tilesArray = Array.from(tiles);
    const tilesData = tilesArray.reduce((acc, curr) => {
        acc.push(curr.getAttribute("data-player"));
        return acc;
    }, []);

    // code for combos below: https://stackoverflow.com/questions/45703381/javascript-tic-tac-toe-how-to-loop-through-win-condition
    const combos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];
    for (let [a, b, c] of combos) {
        if (tilesData[a] && tilesData[a] === tilesData[b] && tilesData[a] === tilesData[c]) {
            currentState.game.winner = tilesData[a];
            break;
        }
    }
    if (currentState.game.winner) {

        console.log("winner: ", currentState.game.winner)
        socket.emit("t3-endGameServer", currentState.game);
    } else if (currentState.game.moveNumber == 9) {
        currentState.game.winner = null;
        socket.emit("t3-endGameServer", currentState.game);
    }
}


if (socket) {
    socket.on("t3-startGame", data => {
        currentState.game = data;
        newT3Game();
    });

    socket.on("t3-playerMadeMove", data => {
        currentState.game = data;
        let clickedTileEl = document.querySelector(`#${currentState.game.clickedTile}`);
        let imgEl = document.createElement("img");
        clickedTileEl.setAttribute("class", "clickedTile boardTile");
        clickedTileEl.setAttribute("data-player", currentState.game.currentPlayer)
        imgEl.setAttribute("class", "clickedTileImage");
        if (currentState.game.currentPlayer == currentState.game.player1) {
            // image source: https://github.com/ryneschillinger/tic-tac-toe/blob/master/img/egg-o.png
            imgEl.setAttribute("src", "/assets/egg-o.png");
        } else {
            // image source: https://github.com/ryneschillinger/tic-tac-toe/blob/master/img/bacon-x.png
            imgEl.setAttribute("src", "/assets/bacon-x.png");
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
        if (!data.winner) {
            alert("congrats on the tie!");
        } else if (data.winner == currentState.user.userID) {
            alert("congrats you won at tic tac toe, you must be really good at life");
        } else {
            alert("sorry you lost, would you like the # to a good therapist?");
        }
        const tiles = document.querySelectorAll(".clickedTile");
        const tilesArray = Array.from(tiles);
        tilesArray.forEach(clickedTileEl => {
            clickedTileEl.setAttribute("class", "t3-tile boardTile");
            clickedTileEl.removeAttribute("data-player");
            clickedTileEl.removeChild(clickedTileEl.children[0]);
        });
        // to do end the game ask for rematch, posts to db
    });
}

// currentState.user.userID