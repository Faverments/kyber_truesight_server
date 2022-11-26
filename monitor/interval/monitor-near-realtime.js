// const { ScheduleTime } = require("../constances");
// let rule = new schedule.RecurrenceRule();

// Object.keys(ScheduleTime).forEach((key) => {
//   schedule.scheduleJob(ScheduleTime[key], () => {
//     console.log(`${ScheduleTime[key]} is running`);
//   });
// });

// 1. fetch lần đầu
// 2. lấy 24 giờ sau -> fetch tiếp -> lấy 24h tiếp
// 3. tối ưu fetch retry and goto

require("dotenv").config();
require("../../models");
const { MONGODB_CONNECTION_STRING } = require("../../config");
console.log(MONGODB_CONNECTION_STRING);
const mongoose = require("mongoose");
async function connect() {
  await mongoose.connect(MONGODB_CONNECTION_STRING);
  console.log("connect mongodb success");
}
connect().catch((err) => console.log(err));

const schedule = require("node-schedule");
const axios = require("axios");
// const TRUE_SIGHT_API = "https://truesight.kyberswap.com";
const TRUE_SIGHT_API = "http://192.168.1.121:8000";

const {
  TIME_FRAME,
  TASK_DELAY,
  MODELS,
  JOB_DELAY,
  RETRY_OPTIONS,
  MESSAGE_TYPE,
} = require("../constances");

const _ = require("lodash");
const { saveTrueSightResponse } = require("../../controllers/monitor");

const { goto } = require("../../utils");

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
  if (getPredictedDate(previousData) !== getPredictedDate(currentData)) {
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
    // mongoose and emit events
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

function getPredictedDate(trueSightData) {
  return trueSightData.data.tokens[0].predicted_date;
}

// đệ quy job
function job(time, timeFrame) {
  schedule.scheduleJob(time, async () => {
    console.log("start task for timeFrame: ", timeFrame);
    let retryOptions = RETRY_OPTIONS.DEFAULT;
    async function callback() {
      const currentData = await fetchData(timeFrame);
      if (currentData !== undefined) {
        let previousDataOfTimeFrame =
          previousDataStore.getPreviousData(timeFrame);
        const result = await isDifferentData(
          previousDataOfTimeFrame,
          currentData,
          timeFrame
        );
        if (result) {
          job(new Date((getPredictedDate(currentData) + JOB_DELAY) * 1000));
          // no retry
          retryOptions = RETRY_OPTIONS.JOB_SCHEDULED;
          return false;
        } else {
          // retry
          retryOptions = RETRY_OPTIONS.DATA_NOT_CHANGE;
          return true;
        }
      } else {
        console.log("error fetch data");
        //retry
        retryOptions = RETRY_OPTIONS.FETCH_DATA_ERROR;
        return true;
      }
    }

    /**
     * @param {{
     *  retry : Boolean,
     * message: String,
     * }} result
     */
    async function condition(result) {
      // conditionResult if true => retry
      if (result.retry) {
        console.log("retry");
        return true;
      } else {
        console.log("no retry");
        return false;
      }
    }

    await goto(callback, condition, {
      retryAmount: retryOptions.retries,
      delayTime: retryOptions.retryDelay,
      retryMessage: "retry",
      errMessage: "failed to retry",
    });

    console.log("end task");
  });
}

async function runMonitor(timeFrame) {
  // first time run
  const trueSightData = await fetchData(timeFrame);
  previousDataStore.setPreviousData(timeFrame, trueSightData);
  const predictedDate = getPredictedDate(trueSightData);
  // interval
  job(new Date((predictedDate + JOB_DELAY) * 1000), timeFrame);
}
async function main() {
  await runMonitor(TIME_FRAME.DAY);
}
main();
