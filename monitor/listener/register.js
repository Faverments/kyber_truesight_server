const monitorManager = require("../emitter");
const { TIME_FRAME, EVENTS } = require("../constances");
const updatePredictedHistoryService = require("../../services/updatePredictedHistory");
const updateDiscoveredHistoryService = require("../../services/updateDiscoveredHistory");
const {
  jsonSaveService,
  jsonSaveTrendingService,
} = require("../../services/jsonSave");
const {
  awsS3SaveTrueSightService,
  awsS3SaveTrendingService,
} = require("../../services/awsS3Save");
const updateTrueSightFilterService = require("../../services/updateTrueSightFilter");

async function syncService(timeframe, data, time) {
  await updateTrueSightFilterService(timeframe, data);
  await updatePredictedHistoryService(timeframe, data, time);
}

monitorManager.on(EVENTS.NEW_DATA, async (timeframe, data, time) => {
  console.log(`${timeframe} data: ${Object.keys(data)}`);
  // ignore save data into local machine
  // jsonSaveService(timeframe, data);
  awsS3SaveTrueSightService(timeframe, data);
  syncService(timeframe, data, time);
});

monitorManager.on(EVENTS.NEW_TRENDING_DATA, (timeframe, data, time) => {
  console.log(`${timeframe} trending data: ${Object.keys(data)}`);
  // ignore save data into local machine
  // jsonSaveTrendingService(timeframe, data);
  awsS3SaveTrendingService(timeframe, data);
  updateDiscoveredHistoryService(timeframe, data);
});
