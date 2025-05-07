/**
 * This is the entry point of the server
 * It creates an express application object and listens on a port
 * The server is started by running the command `npm Start`
 * The server listens on port 8080 by default
 */
import dotenv from "dotenv";
import connection from "./config/db.config.js";
import app from "./app.js";
import {Server} from "socket.io";
import http from "http";
const server = http.createServer(app);
import awsSQSConsumer from "./utils/awsSQSconsumerutil.js";
import { createClient } from "redis"

dotenv.config();
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:3000","http://127.0.0.1:5501"],
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected :: ", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
    // Confirm room joining to client
    socket.emit("room_joined", { userId, socketId: socket.id });
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log("User joined chat :: ", chatId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected :: ", socket.id);
  });
});

// const client = createClient ({
//   url : process.env.REDIS_URL,
// });

// client.on("error", function(err) {
//   throw err;
// });
// client.connect();

await connection();
setInterval(()=>{
  awsSQSConsumer(io)
}, 30000);

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Listning on port ${port}....`));
