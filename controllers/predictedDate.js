const mongoose = require("mongoose");
const express = require("express");
const { MODELS, TIME_FRAME } = require("../constances");
const trueSightResponse24hModel = mongoose.model(
  MODELS.TRUE_SIGHT_RESPONSE_24H
);
const trueSightResponse7dModel = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_7D);

async function getListTrueSightResponseFromMongoDB(
  timeFrame,
  query,
  options,
  sort,
  limit
) {
  try {
    if (timeFrame === TIME_FRAME.DAY) {
      const data = await trueSightResponse24hModel
        .find(query, options)
        .sort(sort)
        .limit(limit);

      return data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const data = await trueSightResponse7dModel
        .find(query, options)
        .sort(sort)
        .limit(limit);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
exports.getListTrueSightResponseFromMongoDB =
  getListTrueSightResponseFromMongoDB;

async function getListTrueSightResponseWarper(timeFrame) {
  const data = await getListTrueSightResponseFromMongoDB(
    timeFrame,
    {},
    {
      _id: 0,
      "data.tokens.predicted_date": 1,
    },
    {
      _id: -1,
    }
  );
  const result = data.map((item) => {
    const predicteds = item.data.tokens.map((obj) => obj.predicted_date);
    const uniquePedicteds = [...new Set(predicteds)];
    return uniquePedicteds;
  });
  return result;
}

exports.getListTrueSightResponseWarper = getListTrueSightResponseWarper;

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.listPredictedDateController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const result = await getListTrueSightResponseWarper(time_frame);
    res.send(result);
    return;
  } catch (error) {
    console.log(error);
  }
};

async function getOneTrueSightResponseFromMongoDB(
  timeFrame,
  query,
  options,
  sort,
  skip
) {
  try {
    if (timeFrame === TIME_FRAME.DAY) {
      const data = await trueSightResponse24hModel
        .findOne(query, options)
        .sort(sort)
        .skip(skip);
      return data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const data = await trueSightResponse7dModel
        .findOne(query, options)
        .sort(sort)
        .skip(skip);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

exports.getOneTrueSightResponseFromMongoDB = getOneTrueSightResponseFromMongoDB;

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.predictedDateController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { predicted_date } = req.query;

    let data;

    if (predicted_date == "") {
      data = await getOneTrueSightResponseFromMongoDB(
        time_frame,
        {},
        {
          _id: 0,
          __v: 0,
          createAt: 0,
          "data.tokens._id": 0,
        },
        { _id: -1 }
      );
    } else {
      data = await getOneTrueSightResponseFromMongoDB(
        time_frame,
        {
          "data.tokens.predicted_date": {
            $in: [Number(predicted_date)],
          },
        },
        {
          _id: 0,
          __v: 0,
          createAt: 0,
          "data.tokens._id": 0,
        }
      );
    }

    if (data) {
      res.send(data);
    } else {
      res.send({
        message: "can not find data from predicted date",
        success: false,
      });
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

async function getMultipleTrueSightResponseFromMongoDB(
  timeFrame,
  query,
  options
) {
  try {
    if (timeFrame === TIME_FRAME.DAY) {
      const data = await trueSightResponse24hModel.find(query, options);
      return data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const data = await trueSightResponse7dModel.find(query, options);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.predictedDatesController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { predicted_dates } = req.query;
    const predictedDatesArr = predicted_dates.split(",");
    const numberPredictedDatesArr = predictedDatesArr.map((item) =>
      Number(item)
    );

    const data = await getMultipleTrueSightResponseFromMongoDB(
      time_frame,
      {
        "data.tokens.predicted_date": {
          $in: numberPredictedDatesArr,
        },
      },
      {
        _id: 0,
        __v: 0,
        createAt: 0,
        "data.tokens._id": 0,
      }
    );
    if (data.length > 0) {
      res.send({
        message: "success",
        success: true,
        data,
        // missCount: predictedDatesArr.length - data.length,
      });
    } else {
      res.send({
        message: "can not find data from predicted date",
        success: false,
      });
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
