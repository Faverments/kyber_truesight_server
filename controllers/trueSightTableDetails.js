const mongoose = require("mongoose");
const express = require("express");
const { MODELS, TIME_FRAME } = require("../constances");
const predictedHistory24hModel = mongoose.model(MODELS.PREDICTED_HISTORY_24h);
const predictedHistory7dModel = mongoose.model(MODELS.PREDICTED_HISTORY_7d);
const discoveredHistory24hModel = mongoose.model(MODELS.DISCOVERED_HISTORY_24h);
const discoveredHistory7dModel = mongoose.model(MODELS.DISCOVERED_HISTORY_7d);

const getListTokenWithPredictedHistory = async (
  timeFrame,
  query,
  options,
  sort
) => {
  try {
    if (timeFrame === "24h") {
      const predictedHistory24h = await predictedHistory24hModel
        .find(query, options)
        .sort(sort);
      return predictedHistory24h;
    } else if (timeFrame === "7d") {
      const predictedHistory7d = await predictedHistory7dModel
        .find(query, options)
        .sort(sort);
      return predictedHistory7d;
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getListTokenWithPredictedHistory = getListTokenWithPredictedHistory;

// if want to get subLast predicted history, please call function before update last predicted history
const getListTokenWithLastPredictedHistory = async (timeFrame, listToken) => {
  return await getListTokenWithPredictedHistory(
    timeFrame,
    {
      token_id: { $in: listToken },
    },
    {
      _id: 0,
      token_id: 1,
      predicteds: {
        $slice: -1,
      },
    }
  );
};
exports.getListTokenWithLastPredictedHistory =
  getListTokenWithLastPredictedHistory;

// logic code hiện tại : predicted history chưa cập nhập => lấy last predicteds element
exports.addLastPredictedHistory = async function (timeframe, dataIncome) {
  const listToken = dataIncome.data.tokens.map((token) => token.token_id);
  const listTokenWithLastPredictedHistory =
    await getListTokenWithLastPredictedHistory(timeframe, listToken);
  dataIncome.data.tokens.forEach((token, index, tokens) => {
    const tokenWithLastPredictedHistory =
      listTokenWithLastPredictedHistory.find(
        (tokenWithLastPredictedHistory) =>
          tokenWithLastPredictedHistory.token_id === token.token_id
      );
    if (tokenWithLastPredictedHistory) {
      dataIncome.data.tokens[index].last_predicted =
        tokenWithLastPredictedHistory.predicteds[0];
    } else {
      dataIncome.data.tokens[index].last_predicted = null;
    }
  });
  // console.log(mergedData);
  return dataIncome;
};

const getListTokenWithDiscoveredHistory = async (
  timeFrame,
  query,
  options,
  sort
) => {
  try {
    if (timeFrame === "24h") {
      const discoveredHistory24h = await discoveredHistory24hModel
        .find(query, options)
        .sort(sort);
      return discoveredHistory24h;
    } else if (timeFrame === "7d") {
      const discoveredHistory7d = await discoveredHistory7dModel
        .find(query, options)
        .sort(sort);
      return discoveredHistory7d;
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getListTokenWithDiscoveredHistory = getListTokenWithDiscoveredHistory;

const getListTokenWithDiscoveredDetails = async (timeFrame, listToken) => {
  return await getListTokenWithDiscoveredHistory(
    timeFrame,
    {
      token_id: { $in: listToken },
    },
    {
      _id: 0,
      token_id: 1,
      discovereds: {
        $slice: -1,
      },
    }
  );
};
exports.getListTokenWithDiscoveredDetails = getListTokenWithDiscoveredDetails;

exports.addDiscoveredDetails = async function (timeframe, dataIncome) {
  const listToken = dataIncome.data.tokens.map((token) => token.token_id);
  const listTokenWithDiscoveredDetails =
    await getListTokenWithDiscoveredDetails(timeframe, listToken);
  dataIncome.data.tokens.forEach((token, index, tokens) => {
    const tokenWithLastDiscoveredDetails = listTokenWithDiscoveredDetails.find(
      (tokenWithLastDiscoveredDetails) =>
        tokenWithLastDiscoveredDetails.token_id === token.token_id
    );
    if (tokenWithLastDiscoveredDetails) {
      dataIncome.data.tokens[index].discovered_trending_data =
        tokenWithLastDiscoveredDetails.discovereds[0];
    } else {
      dataIncome.data.tokens[index].discovered_trending_data = null;
    }
  });
  // console.log(mergedData);
  return dataIncome;
};

exports.trueSightTableDetailsController = async function (req, res) {
  try {
    const { time_frame } = req.params;
    const listToken = [283, 175];
    const result = await getListTokenWithLastPredictedHistory(
      time_frame,
      listToken
    );
    res.send(result);
    // res.send("trueSightFilterController");
    return;
  } catch (error) {
    console.log(error);
  }
};
