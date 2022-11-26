const EventEmitter = require("events");
const { TIME_FRAME, EVENTS } = require("../constances");

class workerManagerContructor extends EventEmitter {
  constructor() {
    super();
  }
}

module.exports = workerManagerContructor;
