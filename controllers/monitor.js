const mongoose = require("mongoose");
const monitorManager = require("../monitor/emitter");
const { MODELS, TIME_FRAME, EVENTS } = require("../monitor/constances");
const TrueSightResponse24h = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_24H);
const TrueSightResponse7d = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_7D);

const TrendingResponse24h = mongoose.model(MODELS.TRENDING_RESPONSE_24H);
const TrendingResponse7d = mongoose.model(MODELS.TRENDING_RESPONSE_7D);

exports.saveTrueSightResponse = async (timeframe, data) => {
  try {
    let newData;
    if (timeframe === TIME_FRAME.DAY) {
      newData = new TrueSightResponse24h(data);
    } else {
      newData = new TrueSightResponse7d(data);
    }
    monitorManager.newData(timeframe, data);
    await newData.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.saveTrendingResponse = async (timeframe, data) => {
  try {
    let newData;
    if (timeframe === TIME_FRAME.DAY) {
      newData = new TrendingResponse24h(data);
    } else {
      newData = new TrendingResponse7d(data);
    }
    monitorManager.newTrendingData(timeframe, data);
    await newData.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
