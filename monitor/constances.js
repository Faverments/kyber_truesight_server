exports.NEXT_PREDICTED_TIME =
  process.env.NODE_ENV == "development" ? 2 * 60 * 1000 : 2 * 60 * 60 * 1000;
exports.TRUE_SIGHT_API =
  process.env.NODE_ENV == "development"
    ? // ? "http://localhost:8000"
      "http://192.168.0.103:8000" // wsl can't use localhost
    : //  ?  "https://truesight.kyberswap.com"
      "https://truesight.kyberswap.com";
exports.TIME_FRAME = {
  DAY: "24h",
  WEEK: "7d",
};
exports.TASK_DELAY =
  process.env.NODE_ENV == "development" ? 5000 : 5 * 60 * 1000;
exports.EVENTS = {
  NEW_DATA: "NEW_DATA",
  NEW_TRENDING_DATA: "NEW_TRENDING_DATA",
};
exports.MODELS = {
  TRUE_SIGHT_RESPONSE_24H: "TrueSightResponse24h",
  TRUE_SIGHT_RESPONSE_7D: "TrueSightResponse7d",
  TRENDING_RESPONSE_24H: "TrendingResponse24h",
  TRENDING_RESPONSE_7D: "TrendingResponse7d",
};
exports.ScheduleTime = {
  // 7:13 am every day gmt+7
  EVERY_DAY_7_13_AM: "0 13 7 * * *",
  // 7:15 pm every day
  EVERY_DAY_7_15_PM: "0 15 19 * * *",
  // 9:38 pm every day gmt+7
  EVERY_DAY_9_38_PM: "0 38 21 * * *",
};

// exports.JOB_DELAY = 60 * 60 * 24;
exports.JOB_DELAY = 60;
exports.RETRY_OPTIONS = {
  DEFAULT: {
    retries: 5,
    retryDelay: 3000,
    message: "DEFAULT",
  },
  JOB_SCHEDULED: {
    retryAmount: 0,
    retryDelay: 0,
    message: "JOB_SCHEDULED",
  },
  DATA_NOT_CHANGE: {
    retryAmount: 5000,
    retryDelay: 20,
    message: "DATA_NOT_CHANGE",
  },
  FETCH_DATA_ERROR: {
    retryAmount: 10000,
    retryDelay: 20,
    message: "FETCH_DATA_ERROR",
  },
};
