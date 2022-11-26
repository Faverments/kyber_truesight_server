const { startMonitor } = require("./interval/monitor-interval");
const {
  startTrendingMonitor,
} = require("./interval/trending-monitor-interval");
module.exports = {
  startMonitor,
  startTrendingMonitor,
};
