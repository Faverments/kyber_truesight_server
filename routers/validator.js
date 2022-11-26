const { param, query, validationResult, oneOf } = require("express-validator");
const { isString, isInteger } = require("lodash");

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const useTimeFrameRule = () => {
  return [
    param("time_frame").custom(function (value) {
      if (value !== "24h" && value !== "7d") {
        throw new Error("Invalid time_frame");
      }
      return true;
    }),
  ];
};

const useCheckQueryPredictedHistory = () => {
  return [
    oneOf([
      query("name").notEmpty(),
      query("id").isInt(),
      query("symbol").notEmpty(),
    ]),
  ];
};

const predictedHistoryRules = () => {
  return [...useTimeFrameRule(), ...useCheckQueryPredictedHistory()];
};
const listPredictedDateRules = () => {
  return [...useTimeFrameRule()];
};

const useCheckQueryPredictedDate = () => {
  return [
    query("predicted_date")
      .exists()
      .custom(function (value) {
        if (value) {
          if (!isNumeric(value)) {
            throw new Error("predicted_date must be numeric");
          }
        }
        return true;
      }),
  ];
};
const predictedDateRules = () => {
  return [...useTimeFrameRule(), ...useCheckQueryPredictedDate()];
};

const useCheckQueryPredictedDates = () => {
  return [
    query("predicted_dates").custom(function (value) {
      const values = value.split(",");
      if (values.length > 10) {
        throw new Error("predicted_dates must be less than 10");
      }
      for (let i = 0; i < values.length; i++) {
        if (!isNumeric(values[i])) {
          throw new Error("predicted_dates must be numeric");
        }
      }
      return true;
    }),
  ];
};
const predictedDatesRules = () => {
  return [...useTimeFrameRule(), ...useCheckQueryPredictedDates()];
};

const useCheckQueryRangeHistory = () => {
  return [
    query("page").isInt({
      min: 0,
    }),
    query("limit").isInt({
      min: 1,
      max: 200,
    }),
  ];
};

const rangeHistoryRules = () => {
  return [...useTimeFrameRule(), ...useCheckQueryRangeHistory()];
};

const trueSightFilterRules = () => {
  return [...useTimeFrameRule()];
};

const navigateTrueSightFilterRules = () => {
  return [...useTimeFrameRule(), query("id").exists()];
};

const navigateTrendingResponseRules = () => {
  return [...useTimeFrameRule(), query("id").exists()];
};

const findTrueSightFilterRules = () => {
  return [...useTimeFrameRule(), query("id").notEmpty()];
};

const listTrueSightFilterRules = () => {
  return [...useTimeFrameRule(), ...useCheckQueryPredictedDates()];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).json({
    errors: errors.array(),
  });
};

module.exports = {
  predictedHistoryRules,
  validate,
  listPredictedDateRules,
  predictedDateRules,
  rangeHistoryRules,
  predictedDatesRules,
  listTrueSightFilterRules,
  trueSightFilterRules,
  findTrueSightFilterRules,
  navigateTrueSightFilterRules,
  navigateTrendingResponseRules,
};
