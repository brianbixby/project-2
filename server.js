"use strict";

const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3000;

const { v4: uuidv4 } = require('uuid');
const http = require('http');
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
  sameSite: 'strict',
  store: new SequelizeStore({ db: sequelize })
};

app.use(session(sess));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use("/", allRoutes);

const openGamesTTC = [];
const inUseTTC = [];
const openGamesC4 = [];
const inUseC4 = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // socket.on('joinSpecificGame', room => {
  //   socket.join(room);
  // })
  // socket.on('joinAnyGame', room => {
  //   socket.join(room);
  // })
  socket.on('joinGame', data => {
    console.log('server join game: ', data);
    let game;
    console.log(data)
    if (data.gameID == 1) {
      if (openGamesTTC.length) {
        game = openGamesTTC.pop();
        game.players = 2;
        game.player2 = data.userID;
        inUseTTC.push(game);
      } else {
        game = { id: uuidv4(), players: 1 };
        game.player1 = data.userID;
        console.log(game.player1)
        openGamesTTC.push(game);
      }
    } else if (data.gameID == 2) {
      if (openGamesC4.length) {
        game = openGamesC4.pop();
        game.players = 2;
        game.player2 = data.userID;
        inUseC4.push(game);
      } else {
        game = { id: uuidv4(), players: 1 };
        game.player1 = data.userID;
        console.log(game.player1)
        openGamesC4.push(game);
      }
    }
    console.log("game server: ", game);
    socket.join(game.id);
    io.to(game.id).emit('joinedGame', game);
  })
  // TODO:
  // have function that handles move then emits back to both clients
  // socket.on("playerMadeMove", data => {
  //   io.to(game.id).emit('playerMadeMove', game);
  // })


  // socket.on('c4move', data => {
  // io.to(data.game.id).emit('joinGame', data);
  // passes the back the data to a function on client that will update the board for both players
  // })
});

sequelize.sync({ force: false }).then(function () {
  server.listen(PORT, function () {
    console.log("Server listening on PORT " + PORT);
  });
});