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

const TrendingResponse24h = mongoose.model(MODELS.TRENDING_RESPONSE_24H);
const TrendingResponse7d = mongoose.model(MODELS.TRENDING_RESPONSE_7D);
const { setAsyncInterval, clearAsyncInterval } = require("../../utils");
const { saveTrendingResponse } = require("../../controllers/monitor");

const previousTrendingDataStore = {
  DAY: null,
  WEEK: null,
  setPreviousData: async (timeFrame, data) => {
    if (timeFrame === TIME_FRAME.DAY) {
      previousTrendingDataStore.DAY = data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      previousTrendingDataStore.WEEK = data;
    }
  },
  getPreviousData: (timeFrame) => {
    if (timeFrame === TIME_FRAME.DAY) {
      return previousTrendingDataStore.DAY;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      return previousTrendingDataStore.WEEK;
    }
  },
};

// IN_DEV BYPASS CLOUDFLARE

async function fetchData(timeFrame) {
  return await axios
    .get(
      `${TRUE_SIGHT_API}/api/v1/trending?timeframe=${timeFrame}&page_number=0&page_size=9999&search_token_name=&search_token_tag=`
    )
    .then((res) => res.data)
    .catch(function (error) {
      console.log(error);
      return undefined;
    });
}

function isEqual(previousData, currentData) {
  const previousTokenIds = previousData.data.tokens.map(
    (token) => token.token_id
  );
  const currentTokensIds = currentData.data.tokens.map(
    (token) => token.token_id
  );
  // Only snapshot when token_id is different, not care rank change
  return _.isEqual(previousTokenIds.sort(), currentTokensIds.sort());
}

async function isDifferentData(previousData, currentData, timeFrame, firstRun) {
  // const compareResult = _.isEqual(previousData, currentData);
  const compareResult = isEqual(previousData, currentData);
  let check;
  if (!compareResult) {
    await saveTrendingResponse(timeFrame, previousData);
    // previousTrendingDataStore.setPreviousData(timeFrame, currentData);
    await saveTrendingResponse(timeFrame, currentData);
    console.log("save new trending data");
    check = true;
  } else {
    // if (firstRun) {
    //   previousTrendingDataStore.setPreviousData(timeFrame, currentData);
    // }
    console.log("no trending change");
    check = false;
  }
  previousTrendingDataStore.setPreviousData(timeFrame, currentData);
  return check;
}

async function setPreviousTrendingDataFirstTime(timeFrame) {
  let previousDataFromMongodb;
  if (timeFrame === TIME_FRAME.DAY) {
    previousDataFromMongodb = await TrendingResponse24h.findOne({}).sort({
      _id: -1,
    });
  } else if (timeFrame === TIME_FRAME.WEEK) {
    previousDataFromMongodb = await TrendingResponse7d.findOne().sort({
      _id: -1,
    });
  }
  const currentData = await fetchData(timeFrame);
  if (previousDataFromMongodb === null) {
    previousTrendingDataStore.setPreviousData(timeFrame, currentData);
    saveTrendingResponse(timeFrame, currentData);
    console.log("first trending response import to mongodb");
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
  return previousTrendingDataStore.getPreviousData(timeFrame);
}

async function trendingMonitor(timeFrame) {
  await setPreviousTrendingDataFirstTime(timeFrame);

  async function task() {
    console.log("start trending task for ", timeFrame);
    const currentData = await fetchData(timeFrame);
    if (currentData !== undefined) {
      let previousDataOfTimeFrame =
        previousTrendingDataStore.getPreviousData(timeFrame);
      await isDifferentData(previousDataOfTimeFrame, currentData, timeFrame);
    } else {
      console.log("error fetch data trending");
    }
    console.log("end trending task");
  }

  setAsyncInterval(task, TASK_DELAY);
}

const { delay } = require("../../utils");

async function startTrendingMonitor() {
  // await Promise.all([
  //   trendingMonitor(TIME_FRAME.DAY),
  //   trendingMonitor(TIME_FRAME.WEEK),
  // ]);
  await trendingMonitor(TIME_FRAME.DAY);
  await delay(5000);
  await trendingMonitor(TIME_FRAME.WEEK);
  // await trendingMonitor(TIME_FRAME.DAY);
}
module.exports = {
  startTrendingMonitor,
};
