"use strict";

function c4setTurnDisplay() {
    const crownTurnEl = document.querySelector("#crownTurn");
    const dragonTurnEl = document.querySelector("#dragonTurn");
    const c4upArrowEl = document.querySelector("#c4upArrow");
    const c4downArrowEl = document.querySelector("#c4downArrow");
    if (currentState.game.currentPlayer == currentState.game.player1) {
        crownTurnEl.setAttribute("src", "/assets/crown.png");
        dragonTurnEl.setAttribute("src", "/assets/dragon-bw.png");
        c4upArrowEl.setAttribute("class", "fa fa-caret-up");
        c4downArrowEl.setAttribute("class", "fa fa-caret-down inactive");
    } else {
        crownTurnEl.setAttribute("src", "/assets/crown-bw.png");
        dragonTurnEl.setAttribute("src", "/assets/dragon.png");
        c4upArrowEl.setAttribute("class", "fa fa-caret-up inactive");
        c4downArrowEl.setAttribute("class", "fa fa-caret-down");
    }
}

function c4handleTileClick(e) {
    if (currentState.game.currentPlayer === currentState.user.userID) {
        let mod = Number(this.getAttribute("data-cellnumber")) % 7;
        mod = mod !== 0 ? mod + 35 : 42;
        while (mod >= 0) {
            const el = document.querySelector(`#c4-${mod}`);
            if (!el.getAttribute("data-player")) {
                currentState.game.clickedTile = `c4-${mod}`;
                socket.emit("c4-playerMadeMoveServer", currentState.game);
                return;
            }
            mod -= 7;
        }
    }
}

function newC4Game() {
    const tiles = document.querySelectorAll(".c4-tile");
    const tilesArray = Array.from(tiles);
    tilesArray.forEach(tile => tile.addEventListener("click", c4handleTileClick));
    currentState.game.moveNumber = 0;
    c4setTurnDisplay();
}

function c4ChkLine(a, b, c, d) {
    return ((a) && (a == b) && (a == c) && (a == d));
}

function c4CheckForWin() {
    const tiles = document.querySelectorAll(".c4-boardTile");
    const tilesArray = Array.from(tiles);
    const tilesData = tilesArray.reduce((acc, curr) => {
        acc.push(curr.getAttribute("data-player"));
        return acc;
    }, []);
    var board2D = new Array();
    let k = 0;
    for (let i = 0; i < 6; i++) {
        board2D[i] = new Array();
        for (let j = 0; j < 7; j++) {
            board2D[i].push(tilesData[k]);
            k++;
        }
    }
    // check for winner code: https://stackoverflow.com/questions/33181356/connect-four-game-checking-for-wins-js
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 7; c++) {
            if (c4ChkLine(board2D[r][c], board2D[r + 1][c], board2D[r + 2][c], board2D[r + 3][c])) {
                currentState.game.winner = currentState.game.currentPlayer;
                currentState.game.loser = currentState.game.winner === currentState.game.player1 ? currentState.game.player2 : currentState.game.player1;
                return true;
            }
        }
    }

    // Check right
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
            if (c4ChkLine(board2D[r][c], board2D[r][c + 1], board2D[r][c + 2], board2D[r][c + 3])) {
                currentState.game.winner = currentState.game.currentPlayer;
                currentState.game.loser = currentState.game.winner === currentState.game.player1 ? currentState.game.player2 : currentState.game.player1;
                return true;
            }
        }
    }

    // Check down-right
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
            if (c4ChkLine(board2D[r][c], board2D[r + 1][c + 1], board2D[r + 2][c + 2], board2D[r + 3][c + 3])) {
                currentState.game.winner = currentState.game.currentPlayer;
                currentState.game.loser = currentState.game.winner === currentState.game.player1 ? currentState.game.player2 : currentState.game.player1;
                return true;
            }
        }
    }

    // Check down-left
    for (let r = 3; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
            if (c4ChkLine(board2D[r][c], board2D[r - 1][c + 1], board2D[r - 2][c + 2], board2D[r - 3][c + 3])) {
                currentState.game.winner = currentState.game.currentPlayer;
                currentState.game.loser = currentState.game.winner === currentState.game.player1 ? currentState.game.player2 : currentState.game.player1;
                return true;
            }
        }
    }

    if (currentState.game.moveNumber == 42) {
        if (!currentState.game.winner) {
            currentState.game.winner = "tie";
            return true;
        }
    }
    return false;
}

function c4CloseGameFinishedModal() {
    currentState.game = {};
    const gameFinishedModalButtonEl = document.querySelector("#gameFinishedModalButton");
    const gameFinishedModalEl = document.querySelector("#gameFinishedModal");
    const gamesOuterContainerEl = document.querySelector("#gamesOuterContainer");
    const c4GameEl = document.querySelector("#c4Game");
    gameFinishedModalButtonEl.removeEventListener("click", c4CloseGameFinishedModal);
    gameFinishedModalEl.classList.remove("show");
    c4GameEl.classList.add("hide");
    gamesOuterContainerEl.classList.remove("hide");
    const tiles = document.querySelectorAll(".c4-clickedTile");
    const tilesArray = Array.from(tiles);
    tilesArray.forEach(clickedTileEl => {
        clickedTileEl.setAttribute("class", "c4-tile boardTile");
        clickedTileEl.removeAttribute("data-player");
        clickedTileEl.removeChild(clickedTileEl.children[0]);
    });
}

if (socket) {
    socket.on("c4-startGame", data => {
        currentState.game = data;
        newC4Game();
    });

    socket.on("c4-playerMadeMove", data => {
        currentState.game = data;
        let gameOver;
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
            gameOver = c4CheckForWin();
        }
        if (gameOver) {
            if (currentState.game.currentPlayer === currentState.user.userID) {
                socket.emit("c4-endGameServer", currentState.game);
            }
        } else {
            currentState.game.currentPlayer = currentState.game.currentPlayer == currentState.game.player1 ? currentState.game.player2 : currentState.game.player1;
            c4setTurnDisplay();
        }
    });

    socket.on("c4-endGame", data => {
        currentState.game = data;
        const gameFinishedModalEl = document.querySelector("#gameFinishedModal");
        const gameFinishedModalButtonEl = document.querySelector("#gameFinishedModalButton");
        const gameFinishedModalTextEl = document.querySelector("#gameFinishedModalText");
        gameFinishedModalButtonEl.addEventListener("click", c4CloseGameFinishedModal);
        if (data.winner === "tie") {
            gameFinishedModalTextEl.textContent = "Congrats on the tie!";
        } else if (data.winner == currentState.user.userID) {
            gameFinishedModalTextEl.textContent = "Congrats you won at Connect 4, you must be really good at life!";
        } else {
            gameFinishedModalTextEl.textContent = "Sorry you lost, would you like the phone number to a good therapist?";
        }
        gameFinishedModalEl.classList.add("show");
        // to do end the game ask for rematch, posts to db
    });
}