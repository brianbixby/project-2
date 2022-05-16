"use strict";

function t3setTurnDisplay() {
    const acornTurnEl = document.querySelector("#acornTurn");
    const squirrelTurnEl = document.querySelector("#squirrelTurn");
    const c4upArrowEl = document.querySelector("#t3upArrow");
    const c4downArrowEl = document.querySelector("#t3downArrow");
    if (currentState.game.currentPlayer == currentState.game.player1) {
        acornTurnEl.setAttribute("src", "/assets/acorn.png");
        squirrelTurnEl.setAttribute("src", "/assets/squirrel-bw.png");
        c4upArrowEl.setAttribute("class", "fa fa-caret-up inactive");
        c4downArrowEl.setAttribute("class", "fa fa-caret-down");
    } else {
        acornTurnEl.setAttribute("src", "/assets/acorn-bw.png");
        squirrelTurnEl.setAttribute("src", "/assets/squirrel.png");
        c4upArrowEl.setAttribute("class", "fa fa-caret-up");
        c4downArrowEl.setAttribute("class", "fa fa-caret-down inactive");
    }
}

function t3HandleTileClick(e) {
    if (currentState.game.currentPlayer === currentState.user.userID) {
        if (e.target.classList.contains("t3-tile")) {
            currentState.game.clickedTile = e.target.id
            socket.emit("t3-playerMadeMoveServer", currentState.game);
        }
    }
}

function newT3Game() {
    const tiles = document.querySelectorAll(".t3-tile");
    const tilesArray = Array.from(tiles);
    tilesArray.forEach(tile => tile.addEventListener("click", t3HandleTileClick));
    currentState.game.moveNumber = 0;
    t3setTurnDisplay();
}

function t3CheckForWin() {
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
            currentState.game.loser = currentState.game.winner === currentState.game.player1 ? currentState.game.player2 : currentState.game.player1;
            return true;
        }
    }
    if (currentState.game.moveNumber == 9) {
        if (!currentState.game.winner) {
            currentState.game.winner = "tie";
            return true;
        }
    }
    return false;
}

function t3CloseGameFinishedModal() {
    currentState.game = {};
    const gameFinishedModalButtonEl = document.querySelector("#gameFinishedModalButton");
    const gameFinishedModalEl = document.querySelector("#gameFinishedModal");
    const ticTacToeGameEl = document.querySelector("#ticTacToeGame");
    const gamesOuterContainerEl = document.querySelector("#gamesOuterContainer");
    gameFinishedModalButtonEl.removeEventListener("click", t3CloseGameFinishedModal);
    gameFinishedModalEl.classList.remove("show");
    ticTacToeGameEl.classList.add("hide");
    gamesOuterContainerEl.classList.remove("hide");
    const tiles = document.querySelectorAll(".clickedTile");
    const tilesArray = Array.from(tiles);
    tilesArray.forEach(clickedTileEl => {
        clickedTileEl.setAttribute("class", "t3-tile boardTile");
        clickedTileEl.removeAttribute("data-player");
        clickedTileEl.removeChild(clickedTileEl.children[0]);
    });
    const listeningTiles = document.querySelectorAll(".boardTile");
    listeningTiles.forEach(tile => tile.removeEventListener("click", t3HandleTileClick));
}


if (socket) {
    socket.on("t3-startGame", data => {
        currentState.game = data;
        newT3Game();
    });

    socket.on("t3-playerMadeMove", data => {
        currentState.game = data;
        let gameOver;
        let clickedTileEl = document.querySelector(`#${currentState.game.clickedTile}`);
        let imgEl = document.createElement("img");
        clickedTileEl.setAttribute("class", "clickedTile boardTile");
        clickedTileEl.setAttribute("data-player", currentState.game.currentPlayer)
        imgEl.setAttribute("class", "clickedTileImage");
        if (currentState.game.currentPlayer == currentState.game.player1) {
            imgEl.setAttribute("src", "/assets/acorn.png");
        } else {
            imgEl.setAttribute("src", "/assets/squirrel.png");
        }
        clickedTileEl.appendChild(imgEl);
        currentState.game.moveNumber++;
        if (currentState.game.moveNumber >= 5) {
            gameOver = t3CheckForWin();
        }
        if (gameOver) {
            if (currentState.game.currentPlayer === currentState.user.userID) {
                socket.emit("t3-endGameServer", currentState.game);
            }
        } else {
            currentState.game.currentPlayer = currentState.game.currentPlayer == currentState.game.player1 ? currentState.game.player2 : currentState.game.player1;
            t3setTurnDisplay()
        }
    });

    socket.on("t3-endGame", data => {
        currentState.game = data;
        const gameFinishedModalEl = document.querySelector("#gameFinishedModal");
        const gameFinishedModalButtonEl = document.querySelector("#gameFinishedModalButton");
        const gameFinishedModalTextEl = document.querySelector("#gameFinishedModalText");
        gameFinishedModalButtonEl.addEventListener("click", t3CloseGameFinishedModal);
        if (data.winner === "tie") {
            gameFinishedModalTextEl.textContent = "Congrats on the tie!";
        } else if (data.winner == currentState.user.userID) {
            gameFinishedModalTextEl.textContent = "Congrats you won at Tic Tac Toe, you must be really good at life!";
        } else {
            gameFinishedModalTextEl.textContent = "Sorry you lost, would you like the phone number to a good therapist?";
        }
        gameFinishedModalEl.classList.add("show");
        // to do end the game ask for rematch, posts to db
    });
}