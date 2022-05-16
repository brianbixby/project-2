"use strict";

const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3000;

const { v4: uuidv4 } = require("uuid");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Requiring our models for syncing
const { Friend, Game, GameInstance, Ranking, User } = require("./models");

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 2 * 60 * 60 * 1000 },
  resave: false,
  saveUninitialized: true,
  sameSite: "strict",
  store: new SequelizeStore({ db: sequelize }),
};

app.use(session(sess));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const hbs = exphbs.create({});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use("/", allRoutes);

function deleteGameInstance(data) {
  return GameInstance.destroy({ where: { id: data.instanceID } })
    .then(() => console.log("success"))
    .catch(err => {
      console.log("err: ", err);
      return null;
    });
}

function createGameInstance(data) {
  return GameInstance.create(data)
    .then(gameData => gameData)
    .catch(err => {
      console.log("err: ", err);
      return null;
    });
}

function updateGameInstance(data) {
  return GameInstance.update(data, { where: { id: data.instanceID } })
    .then(gameData => gameData)
    .catch(err => {
      console.log("err: ", err);
      return null;
    });
}

const openGamesTTC = [];
const inUseTTC = [];
const openGamesC4 = [];
const inUseC4 = [];

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("joinGame", (data) => {
    console.log("server join game: ", data);
    let game;
    console.log(data);
    if (data.gameID == 1) {
      if (openGamesTTC.length) {
        game = openGamesTTC.pop();
        game.players = 2;
        game.player2 = data.userID;
        game.currentPlayer = Math.floor(Math.random() * 2) ? game.player1 : data.userID;
        inUseTTC.push(game);
        socket.join(game.instanceID);
        io.to(game.instanceID).emit("joinedGame", game);
        updateGameInstance({ instanceID: game.instanceID, player2_id: data.userID })
          .then(() => console.log("success"))
          .catch(err => console.log("err: ", err));
      } else {
        createGameInstance({ game_id: data.gameID, player1_id: data.userID })
          .then(gameInstanceData => {
            game = { id: data.gameID, instanceID: gameInstanceData.id, players: 1, player1: data.userID, player2: null };
            openGamesTTC.push(game);
            socket.join(game.instanceID);
            io.to(game.instanceID).emit("joinedGame", game);
          })
          .catch(err => console.log("err: ", err));
      }
    } else if (data.gameID == 2) {
      if (openGamesC4.length) {
        game = openGamesC4.pop();
        game.players = 2;
        game.player2 = data.userID;
        game.currentPlayer = Math.floor(Math.random() * 2) ? game.player1 : data.userID;
        inUseC4.push(game);
        socket.join(game.instanceID);
        io.to(game.instanceID).emit("joinedGame", game);
        updateGameInstance({ instanceID: game.instanceID, player2_id: data.userID })
          .then(() => console.log("success"))
          .catch(err => console.log("err: ", err));
      } else {
        createGameInstance({ game_id: data.gameID, player1_id: data.userID })
          .then(gameInstanceData => {
            game = { id: data.gameID, instanceID: gameInstanceData.id, players: 1, player1: data.userID, player2: null };
            openGamesC4.push(game);
            socket.join(game.instanceID);
            io.to(game.instanceID).emit("joinedGame", game);
          })
          .catch(err => console.log("err: ", err));
      }
    }
    // to do: on game end : give them a option for rematch if no close the socket!!! 
  });

  socket.on("exitWaitingRoom", data => {
    if (data.id == 1) {
      const idx = openGamesTTC.map(e => e.instanceID).indexOf(data.instanceID);
      if (idx !== -1) {
        openGamesTTC.splice(idx, 1);
      }
    } else {
      const index = openGamesC4.map(e => e.instanceID).indexOf(data.instanceID);
      if (index !== -1) {
        openGamesC4.splice(index, 1);
      }
    }
    deleteGameInstance(data);
  });

  // CONNECT 4
  socket.on("c4-startGameServer", data => {
    console.log("c4-startGameServer: ", data);
    io.to(data.instanceID).emit("c4-startGame", data);
  });

  socket.on("c4-playerMadeMoveServer", data => {
    console.log("c4-playerMadeMoveServer: ", data);
    io.to(data.instanceID).emit("c4-playerMadeMove", data);
  });

  socket.on("c4-endGameServer", data => {
    const idx = inUseC4.map(e => e.instanceID).indexOf(data.instanceID);
    if (idx !== -1) {
      inUseC4.splice(idx, 1);
    }
    if (data.winner == "tie") {
      io.to(data.instanceID).emit("c4-endGame", data);
      updateGameInstance({ instanceID: data.instanceID, complete: true, tie: true })
        .then(() => console.log("success"))
        .catch(err => console.log("err: ", err));
    } else {
      io.to(data.instanceID).emit("c4-endGame", data);
      Promise.all([
        updateGameInstance({ instanceID: data.instanceID, winner_id: data.winner, loser_id: data.loser, complete: true }),
        Ranking.increment({ rank: 10 }, { where: { user_id: data.winner, game_id: data.id } }),
        Ranking.increment({ rank: -10 }, { where: { user_id: data.loser, game_id: data.id } })
      ])
        .then(() => console.log("success"))
        .catch(err => console.log("err: ", err));
    }
  });

  // TIC TAC TOE
  socket.on("t3-startGameServer", data => {
    console.log("t3-startGameServer: ", data);
    io.to(data.instanceID).emit("t3-startGame", data);
  });

  socket.on("t3-playerMadeMoveServer", data => {
    console.log("t3-playerMadeMoveServer: ", data);
    io.to(data.instanceID).emit("t3-playerMadeMove", data);
  });

  socket.on("t3-endGameServer", data => {
    const idx = inUseTTC.map(e => e.instanceID).indexOf(data.instanceID);
    if (idx !== -1) {
      inUseTTC.splice(idx, 1);
    }
    if (data.winner == "tie") {
      io.to(data.instanceID).emit("t3-endGame", data);
      updateGameInstance({ instanceID: data.instanceID, complete: true, tie: true })
        .then(() => console.log("success"))
        .catch(err => console.log("err: ", err));
    } else {
      io.to(data.instanceID).emit("t3-endGame", data);
      Promise.all([
        updateGameInstance({ instanceID: data.instanceID, winner_id: data.winner, loser_id: data.loser, complete: true }),
        Ranking.increment({ rank: 10 }, { where: { user_id: data.winner, game_id: data.id } }),
        Ranking.increment({ rank: -10 }, { where: { user_id: data.loser, game_id: data.id } })
      ])
        .then(() => console.log("success"))
        .catch(err => console.log("err: ", err));
    }
  });
});

sequelize.sync({ force: false }).then(function () {
  server.listen(PORT, function () {
    console.log("Server listening on PORT " + PORT);
  });
});