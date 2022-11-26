const { MODELS: MONITER_MODELS } = require("./monitor/constances");
exports.MODELS = {
  PREDICTED_HISTORY_24h: "PredictedHistory24h",
  PREDICTED_HISTORY_7d: "PredictedHistory7d",
  TRUE_SIGHT_FILTER_24h: "TrueSightFilter24h",
  TRUE_SIGHT_FILTER_7d: "TrueSightFilter7d",
  DISCOVERED_HISTORY_24h: "DiscoveredHistory24h",
  DISCOVERED_HISTORY_7d: "DiscoveredHistory7d",
  ...MONITER_MODELS,
};
exports.TIME_FRAME = {
  DAY: "24h",
  WEEK: "7d",
};
exports.FILTER = {
  NEW_DISCOVERED: "NEW_DISCOVERED",
  PREVIOUS_PREDICTED: "PREVIOUS_PREDICTED",
  NEXT_PREDICTED: "NEXT_PREDICTED",
  DISCOVERED_DATE_CHANGE: "DISCOVERED_DATE_CHANGE",
};
