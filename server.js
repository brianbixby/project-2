"use strict";

const express = require("express");
const exphbs = require("express-handlebars");
const allRoutes = require("./controllers");
const session = require("express-session");
const http = require('http');
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = process.env.PORT || 3000;
// Requiring our models for syncing
const { Friend, Game, GameInstance, Ranking, User } = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 2 * 60 * 60 * 1000 },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize })
};
app.use(session(sess));
app.use(express.static('public'));
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use("/", allRoutes);

const openGames = [];
const inUse = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('joinSpecificGame', room => {
    socket.join(room);
  })
  socket.on('joinAnyGame', room => {
    socket.join(room);
  })
});

sequelize.sync({ force: false }).then(function () {
  server.listen(PORT, function () {
    console.log("Server listening on PORT " + PORT);
  });
});