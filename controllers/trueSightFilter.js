const mongoose = require("mongoose");
const express = require("express");
const { MODELS, FILTER, TIME_FRAME } = require("../constances");
const TrueSightResponse24h = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_24H);
const TrueSightResponse7d = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_7D);
const trueSightFilter24h = mongoose.model(MODELS.TRUE_SIGHT_FILTER_24h);
const trueSightFilter7d = mongoose.model(MODELS.TRUE_SIGHT_FILTER_7d);
const predictedHistory24hModel = mongoose.model(MODELS.PREDICTED_HISTORY_24h);
const predictedHistory7dModel = mongoose.model(MODELS.PREDICTED_HISTORY_7d);

const { Schema, Types } = require("mongoose");
const {
  getListTrueSightResponseFromMongoDB,
  getOneTrueSightResponseFromMongoDB,
} = require("./predictedDate");
async function getAllDiscoveredTokenIds(timeFrame) {
  const options = {
    _id: 0,
    token_id: 1,
    predicteds: 1,
  };
  try {
    if (timeFrame === TIME_FRAME.DAY) {
      const data = await predictedHistory24hModel
        .find({}, options)
        .sort({ _id: -1 });

      return data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const data = await predictedHistory7dModel
        .find({}, options)
        .sort({ _id: -1 });

      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
exports.getAllDiscoveredTokenIds = getAllDiscoveredTokenIds;

async function getNearLastResponse(timeFrame) {
  console.log(timeFrame);
  return await getOneTrueSightResponseFromMongoDB(
    timeFrame,
    {},
    {},
    { _id: -1 },
    1
  );
}
exports.getNearLastResponse = getNearLastResponse;

async function getLastResponse(timeFrame) {
  return await getOneTrueSightResponseFromMongoDB(
    timeFrame,
    {},
    {},
    { _id: -1 }
  );
}
exports.getLastResponse = getLastResponse;

const TrueSightResponseFormatOptions = {
  _id: 0,
  __v: 0,
  createAt: 0,
  "data.tokens._id": 0,
};

async function getCurrentResponse(timeFrame) {
  return await getOneTrueSightResponseFromMongoDB(
    timeFrame,
    {},
    // TrueSightResponseFormatOptions,
    {},
    { _id: -1 }
  );
}
exports.getCurrentResponse = getCurrentResponse;

async function getPreviousResponse(timeFrame, curId) {
  // const { _id: curId } = await getCurrentResponse(timeFrame);
  return await getOneTrueSightResponseFromMongoDB(
    timeFrame,
    {
      _id: { $lt: curId },
    },
    {},
    { _id: -1 }
  );
}
exports.getPreviousResponse = getPreviousResponse;

async function getNextResponse(timeFrame, curId) {
  // const { _id: curId } = await getCurrentResponse(timeFrame);
  return await getOneTrueSightResponseFromMongoDB(
    timeFrame,
    {
      _id: { $gt: curId },
    },
    {},
    { _id: 1 }
  );
}
exports.getNextResponse = getNextResponse;

async function getResponseFromId(timeFrame, curId) {
  // const { _id: curId } = await getCurrentResponse(timeFrame);
  return await getOneTrueSightResponseFromMongoDB(
    timeFrame,
    {
      _id: curId,
    },
    {}
  );
}
exports.getResponseFromId = getResponseFromId;

async function getCurrentAndPreviousResponse(timeFrame, curId, limit) {
  return await getListTrueSightResponseFromMongoDB(
    timeFrame,
    {
      _id: { $lte: curId },
    },
    {},
    { _id: -1 },
    limit
  );
}
exports.getCurrentAndPreviousResponse = getCurrentAndPreviousResponse;

async function getCurrentAndNextResponse(timeFrame, curId, limit) {
  return await getListTrueSightResponseFromMongoDB(
    timeFrame,
    {
      _id: { $gte: curId },
    },
    {},
    { _id: 1 },
    limit
  );
}
exports.getCurrentAndNextResponse = getCurrentAndNextResponse;

const insertNewTrueSightFilter = async (timeFrame, data) => {
  try {
    if (timeFrame === "24h") {
      const trueSightFilter24hInstance = new trueSightFilter24h(data);
      await trueSightFilter24hInstance.save(function (err, newTrueSightFilter) {
        if (err) return console.error(err);
        console.log(
          "newTrueSightFilter : " +
            newTrueSightFilter._id +
            " with timeFrame: " +
            timeFrame
        );
      });
    } else if (timeFrame === "7d") {
      const trueSightFilter7dInstance = new trueSightFilter7d(data);
      await trueSightFilter7dInstance.save(function (err, newTrueSightFilter) {
        if (err) return console.error(err);
        console.log(
          "newTrueSightFilter : " +
            newTrueSightFilter._id +
            " with timeFrame: " +
            timeFrame
        );
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.insertNewTrueSightFilter = insertNewTrueSightFilter;

async function getLastTrueSightFilter(timeFrame) {
  try {
    if (timeFrame === TIME_FRAME.DAY) {
      const data = await trueSightFilter24h.findOne({}, {}).sort({ _id: -1 });
      return data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const data = await trueSightFilter7d.findOne({}, {}).sort({ _id: -1 });
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
exports.getLastTrueSightFilter = getLastTrueSightFilter;

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.trueSightFilterController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { id } = req.query;
    const curId = Types.ObjectId(id);
    // console.log(id);
    // const result = await getAllDiscoveredTokenIds(time_frame);
    // const result = await getCurrentResponse(time_frame);
    // const result = await getPreviousResponse(time_frame, curId);
    // const result = await getNextResponse(time_frame, curId);
    // const result = await getResponseFromId(time_frame, curId);
    // const result = await getCurrentAndPreviousResponse(time_frame, curId, 2);
    // const result = await getCurrentAndNextResponse(time_frame, curId, 2);
    // const result = await getNearLastResponse(time_frame);
    const result = await getLastTrueSightFilter(time_frame);
    res.send(result);
    // res.send("trueSightFilterController");
    return;
  } catch (error) {
    console.log(error);
  }
};

async function getOneTrueSightFilterFromMongoDB(
  timeFrame,
  query,
  options,
  sort,
  skip
) {
  try {
    if (timeFrame === TIME_FRAME.DAY) {
      const data = await trueSightFilter24h
        .findOne(query, options)
        .sort(sort)
        .skip(skip);
      return data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const data = await trueSightFilter7d
        .findOne(query, options)
        .sort(sort)
        .skip(skip);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

exports.getOneTrueSightFilterFromMongoDB = getOneTrueSightFilterFromMongoDB;

async function getNearLastTrueSightFilter(timeFrame) {
  return await getOneTrueSightFilterFromMongoDB(timeFrame, {}, {}, { _id: -1 });
}
exports.getNearLastTrueSightFilter = getNearLastTrueSightFilter;

exports.nearLastTrueSightFilter = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { id } = req.query;
    const curId = Types.ObjectId(id);
    const result = await getNearLastResponse(time_frame);
    res.send(result);
    return;
  } catch (error) {
    console.log(error);
  }
};

async function getNextTrueSightFilter(timeFrame, curId) {
  // const { _id: curId } = await getCurrentResponse(timeFrame);
  return await getOneTrueSightFilterFromMongoDB(
    timeFrame,
    {
      _id: { $gt: curId },
    },
    {},
    { _id: 1 }
  );
}
exports.getNextTrueSightFilter = getNextTrueSightFilter;

exports.nextTrueSightFilterController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { id } = req.query;
    const curId = Types.ObjectId(id);
    const result = await getNextTrueSightFilter(time_frame, curId);
    if (result == null) {
      res.status(404).send("Not found");
      return;
    }
    res.send(result);
    return;
  } catch (error) {
    console.log(error);
  }
};

async function getPreviousTrueSightFilter(timeFrame, curId) {
  // const { _id: curId } = await getCurrentResponse(timeFrame);
  return await getOneTrueSightFilterFromMongoDB(
    timeFrame,
    {
      _id: { $lt: curId },
    },
    {},
    { _id: -1 }
  );
}
exports.getPreviousTrueSightFilter = getPreviousTrueSightFilter;

exports.previousTrueSightFilterController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { id } = req.query;
    const curId = Types.ObjectId(id);
    const result = await getPreviousTrueSightFilter(time_frame, curId);
    if (result == null) {
      res.status(404).send("Not found");
      return;
    }
    res.send(result);
  } catch (error) {
    console.log(error);
  }
};

async function getMultipleTrueSightFilterFromMongoDB(
  timeFrame,
  query,
  options,
  sort,
  skip,
  limit
) {
  try {
    if (timeFrame === TIME_FRAME.DAY) {
      const data = await trueSightFilter24h
        .find(query, options)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      return data;
    } else if (timeFrame === TIME_FRAME.WEEK) {
      const data = await trueSightFilter7d
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

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.navigateTrueSightFilterController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { id } = req.query;
    if (id == "") {
      const result = await getMultipleTrueSightFilterFromMongoDB(
        time_frame,
        {},
        {},
        { _id: -1 },
        undefined,
        2
      );
      res.send({
        data: {
          previous_data: result[1],
          current_data: result[0],
          next_data: null,
        },
        message: "success",
        status: 200,
      });
      return;
    }
    const curId = Types.ObjectId(id);
    const result = Promise.all([
      getMultipleTrueSightFilterFromMongoDB(
        time_frame,
        {
          _id: { $lte: curId },
        },
        {},
        { _id: -1 },
        undefined,
        2
      ),
      getNextTrueSightFilter(time_frame, curId),
    ]).then(([previousAndCurrent, next]) => {
      res.send({
        data: {
          previous_data: previousAndCurrent[1],
          current_data: previousAndCurrent[0],
          next_data: next,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(404).send("Not found");
  }
};

exports.listTrueSightFilterController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { predicted_dates } = req.query;
    const predictedDatesArr = predicted_dates.split(",");
    const numberPredictedDatesArr = predictedDatesArr.map((item) =>
      Number(item)
    );

    const data = await getMultipleTrueSightFilterFromMongoDB(
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
        data,
      });
    }
    return;
  } catch (error) {
    console.log(error);
  }
};

exports.trueSightFilterByDateController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const { predicted_date } = req.query;

    let data;

    if (predicted_date == "") {
      data = await getOneTrueSightFilterFromMongoDB(
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
      data = await getOneTrueSightFilterFromMongoDB(
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
