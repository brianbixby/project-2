"use strict";

let gameField;
const board = document.getElementById("game-table");
let currentCol;
let currentRow;
let currentPlayer;
let player1;
let player2;
let instanceID;
let id = 1;



function newC4Game() {
  console.log("newC4Game");
  player1 = currentState.game.player1;
  player2 = currentState.game.player2;
  instanceID = currentState.game.instanceID;
  currentPlayer = Math.floor(Math.random() * 2) ? player1 : player2;
  prepareField();
  placeDisc();
}

function checkForVictory(row, col) {
  console.log("checkForVictory")
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
  console.log("getadj")
  if (cellVal(row, col) == cellVal(row + row_inc, col + col_inc)) {
    return 1 + getAdj(row + row_inc, col + col_inc, row_inc, col_inc);
  } else {
    return 0;
  }
}

function cellVal(row, col) {
  console.log("cellval")
  if (gameField[row] == undefined || gameField[row][col] == undefined) {
    return -1;
  } else {
    return gameField[row][col];
  }
}

function firstFreeRow(col, player) {
  console.log("firstfreerow")
  for (var i = 0; i < 6; i++) {
    if (gameField[i][col] != 0) {
      break;
    }
  }
  gameField[i - 1][col] = player;
  return i - 1;
}

function possibleColumns() {
  console.log("possiblecolumns")
  var moves_array = new Array();
  for (var i = 0; i < 7; i++) {
    if (gameField[0][i] == 0) {
      moves_array.push(i);
    }
  }
  return moves_array;
}

function Disc() {
  console.log("Disc constructor");
  this.player = currentPlayer;
  this.color = currentPlayer == currentState.user.userID ? "red" : "yellow";
  this.id = id.toString();
  id++;

  this.addToScene = function () {
    console.log("DISC: addtoscene")
    const madeMove = '<div id="d' + this.id + '" class="disc ' + this.color + '"></div>';
    board.innerHTML += madeMove;
  };

  document.onmousemove = function (evt) {
    // TODO: make it only work if its the current players turn
    if (currentPlayer !== currentState.user.userID) {
      return;
    } else {
      currentCol = Math.floor((evt.clientX - board.offsetLeft) / 60);
      if (currentCol < 0) {
        currentCol = 0;
      }
      if (currentCol > 6) {
        currentCol = 6;
      }
      document.getElementById("d" + this.id).style.left =
        14 + 60 * currentCol + "px";
      document.getElementById("d" + this.id).style.top = "-55px";
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
    document.getElementById("d" + this.id).style.left =
      14 + 60 * currentCol + "px";
    document.getElementById("d" + this.id).style.top = "-55px";
  };

  document.onclick = function (evt) {
    if (currentPlayer !== currentState.user.userID) {
      return;
    } else {
      if (possibleColumns().indexOf(currentCol) != -1) {
        //  TODO: emit to server
        dropDisc(this.id, this.player);
      }
    }
  };
}

function dropDisc(diskID, player) {
  console.log("dropDisc")
  currentRow = firstFreeRow(currentCol, player);
  let playerChoice = {
    who: diskID,
    where: 14 + currentRow * 60
  }
  moveit(playerChoice.who, playerChoice.where);
  currentPlayer = player;
  checkForMoveVictory();
}

function checkForMoveVictory() {
  console.log("checkForMoveVictor");
  if (!checkForVictory(currentRow, currentCol)) {
    if (currentPlayer == currentState.user.userID) {
      placeDisc();
    } else {
      return;
    }
  } else {
    var ww = currentPlayer == currentState.user.userID ? "Player 2" : "Player 1";
    alert(ww + " win!");
    board.innerHTML = "";
    newC4Game();
  }
}

function placeDisc() {
  console.log("placeDisc")
  var disc = new Disc();
  disc.addToScene();
}

function prepareField() {
  console.log("prepareField")
  gameField = new Array();
  for (var i = 0; i < 6; i++) {
    gameField[i] = new Array();
    for (var j = 0; j < 7; j++) {
      gameField[i].push(0);
    }
  }
}

function moveit(who, where) {
  console.log("moveit")
  document.getElementById("d" + who).style.top = where + "px";
}