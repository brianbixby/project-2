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
const { Server, Socket } = require("socket.io");
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

const openGamesTTC = [];
const inUseTTC = [];
const openGamesC4 = [];
const inUseC4 = [];


io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on('disconnect', (reason) => {
    console.log(reason)
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
      } else {
        game = { id: data.gameID, instanceID: uuidv4(), players: 1, player1: data.userID, player2: null };
        console.log(game.player1);
        console.log('before ================================')
        console.log(game)
        openGamesTTC.push(game);
        console.log('after =========================================')
        console.log(game)
      }
    } else if (data.gameID == 2) {
      if (openGamesC4.length) {
        game = openGamesC4.pop();
        game.players = 2;
        game.player2 = data.userID;
        game.currentPlayer = Math.floor(Math.random() * 2) ? game.player1 : data.userID;
        inUseC4.push(game);
      } else {
        game = { id: data.gameID, instanceID: uuidv4(), players: 1, player1: data.userID, player2: null };
        console.log(game.player1);
        openGamesC4.push(game);
      }
    }
    console.log("game server: ", game);
    socket.join(game.instanceID);
    io.to(game.instanceID).emit("joinedGame", game);
    // to do: on game end : give them a option for rematch if no close the socket!!! 
  });

  
  
  // CONNECT 4
  socket.on("startGameServer", data => {
    console.log("startGameServer: ", data);
    io.to(data.instanceID).emit("startGame", data);
  });

  socket.on("playerMadeMoveServer", data => {
    console.log("playerMadeMoveServer: ", data);
    io.to(data.instanceID).emit("playerMadeMove", data);
  });

  socket.on("endGameServer", data => {
    console.log("endGameServer: ", data);
    io.to(data.instanceID).emit("endGame", data);
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
    console.log("c4-endGameServer: ", data);
    // to do: put game on db
    io.to(data.instanceID).emit("c4-endGame", data);
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
    console.log("t3-endGameServer: ", data);
    // to do: put game on db
    io.to(data.instanceID).emit("t3-endGame", data);
  });
});

sequelize.sync({ force: false }).then(function () {
  server.listen(PORT, function () {
    console.log("Server listening on PORT " + PORT);
  });
});