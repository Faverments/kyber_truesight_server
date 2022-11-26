const EventEmitter = require("events");
const { TIME_FRAME, EVENTS } = require("../constances");

class monitorManagerContructor extends EventEmitter {
  constructor() {
    super();
  }
  newData(timeframe, data) {
    this.emit(EVENTS.NEW_DATA, timeframe, data, Date.now());
  }
  newTrendingData(timeframe, data) {
    this.emit(EVENTS.NEW_TRENDING_DATA, timeframe, data, Date.now());
  }
}

module.exports = monitorManagerContructor;
