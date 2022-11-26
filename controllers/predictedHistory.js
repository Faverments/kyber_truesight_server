const mongoose = require("mongoose");
const express = require("express");
const { MODELS, TIME_FRAME } = require("../constances");
const predictedHistory24hModel = mongoose.model(MODELS.PREDICTED_HISTORY_24h);
const predictedHistory7dModel = mongoose.model(MODELS.PREDICTED_HISTORY_7d);

const insertNewPredictedHistory = async (timeFrame, data) => {
  try {
    if (timeFrame === "24h") {
      const predictedHistory24h = new predictedHistory24hModel(data);
      await predictedHistory24h.save(function (err, newTokenHistory) {
        if (err) return console.error(err);
        console.log(
          "newTokenHistory : " +
            newTokenHistory.token_id +
            " with timeFrame: " +
            timeFrame
        );
      });
    } else if (timeFrame === "7d") {
      const predictedHistory7d = new predictedHistory7dModel(data);
      await predictedHistory7d.save(function (err, newTokenHistory) {
        if (err) return console.error(err);
        console.log(
          "newTokenHistory : " +
            newTokenHistory.token_id +
            " with timeFrame: " +
            timeFrame
        );
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.insertNewPredictedHistory = insertNewPredictedHistory;

const updatePredictedHistory = async (timeFrame, data) => {
  try {
    if (timeFrame === "24h") {
      await predictedHistory24hModel.updateOne(
        {},
        { $set: data },
        { upsert: true }
      );
    } else if (timeFrame === "7d") {
      await predictedHistory7dModel.updateOne(
        {},
        { $set: data },
        { upsert: true }
      );
    }
  } catch (error) {
    console.log(error);
  }
};
exports.updatePredictedHistory = updatePredictedHistory;

const getPredictedHistory = async (timeFrame, query, options) => {
  try {
    if (timeFrame === "24h") {
      const predictedHistory24h = await predictedHistory24hModel.findOne(
        query,
        options
      );
      return predictedHistory24h;
    } else if (timeFrame === "7d") {
      const predictedHistory7d = await predictedHistory7dModel.findOne(
        query,
        options
      );
      return predictedHistory7d;
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getPredictedHistory = getPredictedHistory;

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */

exports.predictedHistoryController = async function (req, res) {
  try {
    let name = req.query.name;
    let symbol = req.query.symbol;
    let id = req.query.id;
    if (
      (name && id && symbol) ||
      (name && id) ||
      (name && symbol) ||
      (id && symbol) ||
      (!name && !id && !symbol)
    ) {
      throw new Error("only one of name, id, symbol should be provided");
    }
    let time_frame = req.params.time_frame;

    async function getPredictedHistoryWapper(query) {
      return await getPredictedHistory(time_frame, query, {
        _id: 0,
        __v: 0,
        createAt: 0,
        "predicteds._id": 0,
      });
    }
    let token;
    if (name) token = await getPredictedHistoryWapper({ name });
    if (symbol)
      token = await getPredictedHistoryWapper({ symbol: symbol.toUpperCase() });
    if (id) token = await getPredictedHistoryWapper({ token_id: Number(id) });

    if (token) {
      res.send(token);
    } else {
      res.status(404).send({
        message: "can not find token",
        success: false,
      });
    }
    return;
  } catch (error) {
    res.send({
      errMessage: error.message,
      routerErrMessage: "error catch in router /predicted_history/:time_frame",
      success: false,
    });
  }
};

const getRangeHistoryFromMongoDB = async (timeFrame, page, limit) => {
  try {
    const formatOptions = {
      _id: 0,
      __v: 0,
      createAt: 0,
      "predicteds._id": 0,
    };
    if (timeFrame === TIME_FRAME.DAY) {
      const rangeHistory24h = await predictedHistory24hModel
        .find({}, formatOptions)
        .skip(page * limit)
        .limit(limit)
        .sort({ "predicteds.discovered_on": -1 });
      return rangeHistory24h;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const rangeHistory7d = await predictedHistory7dModel
        .find({}, formatOptions)
        .skip(page * limit)
        .limit(limit)
        .sort({ "predicteds.discovered_on": -1 });
      return rangeHistory7d;
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.rangeHistoryController = async function (req, res) {
  try {
    let time_frame = req.params.time_frame;
    let page = req.query.page;
    let limit = req.query.limit;
    // if (!page) page = 0;
    // if (!limit) limit = 10;
    let rangeHistory = await getRangeHistoryFromMongoDB(
      time_frame,
      page,
      limit
    );
    let totalNumberToken;
    if (time_frame === TIME_FRAME.DAY) {
      totalNumberToken = await predictedHistory24hModel.countDocuments();
    } else if (time_frame === TIME_FRAME.WEEK) {
      totalNumberToken = await predictedHistory7dModel.countDocuments();
    }
    res.send({
      total_number_tokens: totalNumberToken,
      tokens: rangeHistory,
    });
    return;
  } catch (error) {
    res.send({
      errMessage: error.message,
      routerErrMessage: "error catch in router /range_history/:time_frame",
      success: false,
    });
  }
};
