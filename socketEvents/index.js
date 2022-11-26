const monitorManager = require("../monitor/emitter");
const { TIME_FRAME, EVENTS } = require("../monitor/constances");
const {} = require("socket.io");
module.exports = (io, socket) => {
  monitorManager.on(EVENTS.NEW_DATA, (timeframe, data, time) => {
    socket.emit(EVENTS.NEW_DATA, { timeframe, data, time });
  });

  monitorManager.on(EVENTS.NEW_TRENDING_DATA, (timeframe, data, time) => {
    socket.emit(EVENTS.NEW_TRENDING_DATA, { timeframe, data, time });
  });
};
