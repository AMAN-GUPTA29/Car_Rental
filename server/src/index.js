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
import awsSQSConsumer from "./controllers/consumer/biddingdb.controller.js";

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected :: ", socket.id);
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log("User joined chat :: ", chatId);
  });

  socket.on("disconnect", (socket) => {
    console.log("User disconnected :: ", socket.id);
  });
});

dotenv.config();
await connection();
setInterval(awsSQSConsumer, 10000);

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Listning on port ${port}....`));
