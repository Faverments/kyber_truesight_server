const { io } = require("socket.io-client");
const socket = io("http://localhost:8008");
const { TIME_FRAME, EVENTS } = require("../monitor/constances");
socket.on("connect", () => {
  console.log("connected");
});
/**
 * data format:
 * {
 *  timeframe,
 *  data,
 *  time
 * }
 */
socket.on(EVENTS.NEW_DATA, (data) => {
  console.log(data);
});
socket.on(EVENTS.NEW_TRENDING_DATA, (data) => {
  console.log(data);
});
