"use strict";

let gameField = new Array();
const board = document.getElementById("game-table");
let currentCol;
let currentRow;
let currentPlayer;
let id = 1;

newgame();

function newgame() {
  prepareField();
  placeDisc(Math.floor(Math.random() * 2) + 1);
}

function checkForVictory(row, col) {
  if (getAdj(row, col, 0, 1) + getAdj(row, col, 0, -1) > 2) {
    return true;
  } else {
    if (getAdj(row, col, 1, 0) > 2) {
      return true;
    } else {
      if (getAdj(row, col, -1, 1) + getAdj(row, col, 1, -1) > 2) {
        return true;
      } else {
        if (getAdj(row, col, 1, 1) + getAdj(row, col, -1, -1) > 2) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

function getAdj(row, col, row_inc, col_inc) {
  if (cellVal(row, col) == cellVal(row + row_inc, col + col_inc)) {
    return 1 + getAdj(row + row_inc, col + col_inc, row_inc, col_inc);
  } else {
    return 0;
  }
}

function cellVal(row, col) {
  if (gameField[row] == undefined || gameField[row][col] == undefined) {
    return -1;
  } else {
    return gameField[row][col];
  }
}

function firstFreeRow(col, player) {
  for (var i = 0; i < 6; i++) {
    if (gameField[i][col] != 0) {
      break;
    }
  }
  gameField[i - 1][col] = player;
  return i - 1;
}

function possibleColumns() {
  var moves_array = new Array();
  for (var i = 0; i < 7; i++) {
    if (gameField[0][i] == 0) {
      moves_array.push(i);
    }
  }
  return moves_array;
}

function Disc(player) {
  this.player = player;
  this.color = player == player1 ? "red" : "yellow";
  this.id = id.toString();
  id++;

  this.addToScene = function () {
    const madeMove = '<div id="d' + this.id + '" class="disc ' + this.color + '"></div>';
    board.innerHTML += madeMove;
    socket.to(game.id).emit('playerMadeMove', )
  };

  var $this = this;

  document.onmousemove = function (evt) {
    // TODO: make it only work if its the current players turn
    if (currentPlayer !== myPlayerId) {
      return;
    }else{
      currentCol = Math.floor((evt.clientX - board.offsetLeft) / 60);
      if (currentCol < 0) {
        currentCol = 0;
      }
      if (currentCol > 6) {
        currentCol = 6;
      }
      document.getElementById("d" + $this.id).style.left =
        14 + 60 * currentCol + "px";
      document.getElementById("d" + $this.id).style.top = "-55px";
    }
  };

  document.onload = function (evt) {
    currentCol = Math.floor((evt.clientX - board.offsetLeft) / 60);
    if (currentCol < 0) {
      currentCol = 0;
    }
    if (currentCol > 6) {
      currentCol = 6;
    }
    document.getElementById("d" + $this.id).style.left =
      14 + 60 * currentCol + "px";
    document.getElementById("d" + $this.id).style.top = "-55px";
  };

  document.onclick = function (evt) {
    //  TODO: 
     if (currentPlayer = myPlayerId) {
    // emit to server

     socket.on("playerMadeMove", data => {

     })

    if (possibleColumns().indexOf(currentCol) != -1) {
      dropDisc($this.id, $this.player);

      }
    }
  };
}

function dropDisc(cid, player) {
  currentRow = firstFreeRow(currentCol, player);
  moveit(cid, 14 + currentRow * 60);
  currentPlayer = player;
  checkForMoveVictory();
}

function checkForMoveVictory() {
  if (!checkForVictory(currentRow, currentCol)) {
    if(player !== player1){
      placeDisc(player1);
    } else{
      placeDisc(player2);
    }
  } else {
    var ww = currentPlayer == player2 ? "Player 2" : "Player 1";
    alert(ww + " win!");
    board.innerHTML = "";
    newgame();
  }
}

function placeDisc(player) {
  currentPlayer = player;
  var disc = new Disc(player);
  disc.addToScene();
}

function prepareField() {
  gameField = new Array();
  for (var i = 0; i < 6; i++) {
    gameField[i] = new Array();
    for (var j = 0; j < 7; j++) {
      gameField[i].push(0);
    }
  }
}

function moveit(who, where) {
  document.getElementById("d" + who).style.top = where + "px";
}
