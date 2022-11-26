var express = require("express");
var router = express.Router();
const {
  predictedHistoryRules,
  listPredictedDateRules,
  predictedDateRules,
  rangeHistoryRules,
  validate,
  predictedDatesRules,
  listTrueSightFilterRules,
  trueSightFilterRules,
  findTrueSightFilterRules,
  navigateTrueSightFilterRules,
  navigateTrendingResponseRules,
} = require("./validator");
const {
  predictedHistoryController,
  rangeHistoryController,
} = require("../controllers/predictedHistory");
const {
  predictedDateController,
  listPredictedDateController,
  predictedDatesController,
} = require("../controllers/predictedDate");
const {
  trueSightFilterController,
  listTrueSightFilterController,
  nextTrueSightFilterController,
  previousTrueSightFilterController,
  nearLastTrueSightFilter,
  navigateTrueSightFilterController,
  trueSightFilterByDateController,
} = require("../controllers/trueSightFilter");
const {
  trueSightTableDetailsController,
} = require("../controllers/trueSightTableDetails");
const {
  navigateTrendingResponseController,
} = require("../controllers/trendingResponse");
router.use(function timeLog(req, res, next) {
  const currentTime = new Date();
  console.log(
    currentTime.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }) +
      ": " +
      req.url
  );
  next();
});

router.get("/", function (req, res) {
  res.send({
    message: "Welcome to the API",
  });
});

router.get(
  "/predicted_history/:time_frame",
  predictedHistoryRules(),
  validate,
  predictedHistoryController
);
router.get(
  "/list_predicted_date/:time_frame",
  listPredictedDateRules(),
  validate,
  listPredictedDateController
);
router.get(
  "/predicted_date/:time_frame",
  predictedDateRules(),
  validate,
  predictedDateController
);
router.get(
  "/range_history/:time_frame",
  rangeHistoryRules(),
  validate,
  rangeHistoryController
);
router.get(
  "/predicted_dates/:time_frame",
  predictedDatesRules(),
  validate,
  predictedDatesController
);

router.get(
  "/truesight_filter/:time_frame", // lastest true sight filter (mean : current time)
  trueSightFilterRules(),
  validate,
  trueSightFilterController
);

router.get(
  "/truesight_history_by_date/:time_frame",
  predictedDateRules(),
  validate,
  trueSightFilterByDateController
);

router.get(
  "/truesight_history/:time_frame",
  navigateTrueSightFilterRules(),
  validate,
  navigateTrueSightFilterController
);

router.get(
  "/trending_history/:time_frame",
  navigateTrendingResponseRules(),
  validate,
  navigateTrendingResponseController
);

router.get(
  "/near_last_truesight_filter/:time_frame", // near last true sight filter
  trueSightFilterRules(),
  validate,
  nearLastTrueSightFilter
);
router.get(
  "/next_truesight_filter/:time_frame",
  findTrueSightFilterRules(),
  validate,
  nextTrueSightFilterController
);

router.get(
  "/previous_truesight_filter/:time_frame",
  findTrueSightFilterRules(),
  validate,
  previousTrueSightFilterController
);

router.get(
  "/list_truesight_filter/:time_frame",
  listTrueSightFilterRules(),
  validate,
  listTrueSightFilterController
);

router.get(
  "/truesight_table_details/:time_frame",
  trueSightTableDetailsController
);

// setTimeout(() => {
//   throw new Error("Error test");
// }, 5000);
// router.get("/error", function (req, res) {
//   throw new Error("error");
// });
// router.get("/match", function (req, res) {
//   console.log("match 1");
//   res.send({
//     message: "match 1",
//   });
// });

// router.get("/match", function (req, res) {
//   console.log("match 2");
//   res.send({
//     message: "match 2",
//   });
// });

module.exports = router;
