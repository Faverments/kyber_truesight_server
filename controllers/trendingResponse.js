const mongoose = require("mongoose");
const express = require("express");
const { MODELS, FILTER, TIME_FRAME } = require("../constances");

const trendingResponse24h = mongoose.model(MODELS.TRENDING_RESPONSE_24H);
const trendingResponse7d = mongoose.model(MODELS.TRENDING_RESPONSE_7D);
const { Schema, Types } = require("mongoose");

async function getOneTrendingResponseFromMongoDB(
  timeFrame,
  query,
  options,
  sort,
  skip
) {
  try {
    if (timeFrame === TIME_FRAME.DAY) {
      const data = await trendingResponse24h
        .findOne(query, options)
        .sort(sort)
        .skip(skip);
      return data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const data = await trendingResponse7d
        .findOne(query, options)
        .sort(sort)
        .skip(skip);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getMultipleTrendingResponseFromMongoDB(
  timeFrame,
  query,
  options,
  sort,
  skip,
  limit
) {
  try {
    if (timeFrame === TIME_FRAME.DAY) {
      const data = await trendingResponse24h
        .find(query, options)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      return data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const data = await trendingResponse7d
        .find(query, options)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

async function getNextTrendingResponse(timeFrame, curId) {
  // const { _id: curId } = await getCurrentResponse(timeFrame);
  return await getOneTrendingResponseFromMongoDB(
    timeFrame,
    {
      _id: { $gt: curId },
    },
    {},
    { _id: 1 }
  );
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.navigateTrendingResponseController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { id } = req.query; // only id of document afterChange, if use if of document beforeChange the time will be wrong
    if (id == "") {
      const result = await getMultipleTrendingResponseFromMongoDB(
        time_frame,
        {},
        {},
        { _id: -1 },
        undefined,
        4
      );
      res.send({
        data: {
          current_data: result[0],
          previous_data: result[2],
          next_data: null,
          current_data_before_change: result[1],
          previous_data_before_change: result[3],
          next_data_before_change: null,
        },
        message: "success",
        status: 200,
      });
      return;
    }
    const curId = Types.ObjectId(id);
    const result = Promise.all([
      getMultipleTrendingResponseFromMongoDB(
        time_frame,
        {
          _id: { $lte: curId },
        },
        {},
        { _id: -1 },
        undefined,
        4
      ),
      getMultipleTrendingResponseFromMongoDB(
        time_frame,
        {
          _id: { $gt: curId },
        },
        {},
        { _id: -1 },
        undefined,
        2
      ),
    ]).then(([previousAndCurrent, next]) => {
      res.send({
        data: {
          current_data: previousAndCurrent[0],
          previous_data: previousAndCurrent[2],
          next_data: next[0] ? next[0] : null,
          current_data_before_change: previousAndCurrent[1],
          previous_data_before_change: previousAndCurrent[3],
          next_data_before_change: next[1] ? next[1] : null,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(404).send("Not found");
  }
};
