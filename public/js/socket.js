const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);