const axios = require("axios");
const e = require("cors");
const mongoose = require("mongoose");
const _ = require("lodash");
// var diff = require("deep-diff").diff;
const fs = require("fs");
const {
  TRUE_SIGHT_API,
  TIME_FRAME,
  TASK_DELAY,
  MODELS,
} = require("../constances");

const TrueSightResponse24h = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_24H);
const TrueSightResponse7d = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_7D);
const { setAsyncInterval, clearAsyncInterval } = require("../../utils");
const { saveTrueSightResponse } = require("../../controllers/monitor");

const previousDataStore = {
  DAY: null,
  WEEK: null,
  setPreviousData: async (timeFrame, data) => {
    if (timeFrame === TIME_FRAME.DAY) {
      previousDataStore.DAY = data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      previousDataStore.WEEK = data;
    }
  },
  getPreviousData: (timeFrame) => {
    if (timeFrame === TIME_FRAME.DAY) {
      return previousDataStore.DAY;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      return previousDataStore.WEEK;
    }
  },
};

// IN_DEV BYPASS CLOUDFLARE

async function fetchData(timeFrame) {
  return await axios
    .get(
      `${TRUE_SIGHT_API}/api/v1/trending-soon?timeframe=${timeFrame}&page_number=0&page_size=9999&search_token_name&search_token_tag`
    )
    .then((res) => res.data)
    .catch(function (error) {
      console.log(error);
      return undefined;
    });
}
function isEqual(previousData, currentData) {
  if (
    previousData.data.tokens[0].predicted_date !==
    currentData.data.tokens[0].predicted_date
  ) {
    return false;
  } else {
    return true;
  }
}

async function isDifferentData(previousData, currentData, timeFrame, firstRun) {
  // const compareResult = _.isEqual(previousData, currentData);
  const compareResult = isEqual(previousData, currentData);
  if (!compareResult) {
    previousDataStore.setPreviousData(timeFrame, currentData);
    await saveTrueSightResponse(timeFrame, currentData);
    console.log("save new data");
    return true;
  } else {
    if (firstRun) {
      previousDataStore.setPreviousData(timeFrame, currentData);
    }
    console.log("no change");
    return false;
  }
}

async function setPreviousDataFirstTime(timeFrame) {
  let previousDataFromMongodb;
  if (timeFrame === TIME_FRAME.DAY) {
    previousDataFromMongodb = await TrueSightResponse24h.findOne({}).sort({
      _id: -1,
    });
  } else if (timeFrame === TIME_FRAME.WEEK) {
    previousDataFromMongodb = await TrueSightResponse7d.findOne().sort({
      _id: -1,
    });
  }
  const currentData = await fetchData(timeFrame);
  if (previousDataFromMongodb === null) {
    previousDataStore.setPreviousData(timeFrame, currentData);
    saveTrueSightResponse(timeFrame, currentData);
    console.log("first response import to mongodb");
  } else {
    const { status, message, data } = previousDataFromMongodb;
    const formatPreviousDataFromMongodb = JSON.parse(
      JSON.stringify({ status, message, data })
    );
    formatPreviousDataFromMongodb.data.tokens.forEach((token) => {
      delete token._id;
    });
    // var differences = diff(formatPreviousDataFromMongodb, currentData);
    // console.log(differences);
    await isDifferentData(
      formatPreviousDataFromMongodb,
      currentData,
      timeFrame,
      true
    );
  }
  return previousDataStore.getPreviousData(timeFrame);
}

async function monitor(timeFrame) {
  await setPreviousDataFirstTime(timeFrame);

  async function task() {
    console.log("start task for timeFrame: ", timeFrame);
    const currentData = await fetchData(timeFrame);
    if (currentData !== undefined) {
      let previousDataOfTimeFrame =
        previousDataStore.getPreviousData(timeFrame);
      await isDifferentData(previousDataOfTimeFrame, currentData, timeFrame);
    } else {
      console.log("error fetch data");
    }
    console.log("end task");
  }

  setAsyncInterval(task, TASK_DELAY);
}

const { delay } = require("../../utils");

async function startMonitor() {
  // await Promise.all([monitor(TIME_FRAME.DAY), monitor(TIME_FRAME.WEEK)]);
  await monitor(TIME_FRAME.DAY);
  await delay(5000);
  await monitor(TIME_FRAME.WEEK);
  // await monitor(TIME_FRAME.DAY);
}
module.exports = {
  startMonitor,
};
