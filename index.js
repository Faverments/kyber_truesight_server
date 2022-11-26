require("dotenv").config();
if (process.env.NODE_ENV === "production") {
  // overload if use logs
  // require("./overwrite");
}
const mongoose = require("mongoose");
const express = require("express");
const { MONGODB_CONNECTION_STRING } = require("./config");
require("./models");
const { startMonitor, startTrendingMonitor } = require("./monitor");
require("./monitor/listener/register");
const { delay } = require("./utils");
async function connect() {
  await mongoose.connect(MONGODB_CONNECTION_STRING);
  console.log("connect mongodb success");
  await delay(10 * 1000);
  if (process.env.NODE_ENV === "production" && process.env.MODE === "monitor") {
    console.log("start monitor");
    await startMonitor();
    await delay(60 * 1000);
    await startTrendingMonitor();
  }
  // DEV monitor only
  // await startMonitor();
  // await startTrendingMonitor();
  if (
    process.env.NODE_ENV === "development" &&
    process.env.MODE === "monitor"
  ) {
    console.log("start monitor");
    await startMonitor();
    await delay(60 * 1000);
    await startTrendingMonitor();
  }
}
connect().catch((err) => console.log(err));

// require("./test/insert-mongo");
var cors = require("cors");
const app = express();
var https = require("https");
const fs = require("fs");
const httpServer = require("http").createServer(app);
var port = process.env.PORT || 8008;
var httpsPort = process.env.HTTPS_PORT || 443;

var options = {
  key: fs.readFileSync("security/cert.key"),
  cert: fs.readFileSync("security/cert.pem"),
};

app.use(cors());
app.use(express.json());

var api = require("./routers");
app.use("/", api);

const optionsIo = {
  cors: {
    origin: "*",
  },
};
const io = require("socket.io")(httpServer, optionsIo);

const socketEvents = require("./socketEvents/index");

const onConnection = (socket) => {
  console.log("connected");
  const onDisconnected = () => {
    console.log("disconnected");
  };
  socket.on("disconnect", onDisconnected);
  socketEvents(io, socket);
};
io.on("connection", onConnection);

httpServer.listen(port, () => {
  console.log(`listening on ${port}`);
});
https.createServer(options, app).listen(httpsPort, () => {
  console.log(`https listening on ${httpsPort}`);
});

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});
