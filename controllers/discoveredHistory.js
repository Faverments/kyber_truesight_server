const mongoose = require("mongoose");
const express = require("express");
const { MODELS, TIME_FRAME } = require("../constances");
const discoveredHistory24hModel = mongoose.model(MODELS.DISCOVERED_HISTORY_24h);
const discoveredHistory7dModel = mongoose.model(MODELS.DISCOVERED_HISTORY_7d);

const getDiscoveredHistory = async (timeFrame, query, options) => {
  try {
    if (timeFrame === "24h") {
      const discoveredHistory24h = await discoveredHistory24hModel.findOne(
        query,
        options
      );
      return discoveredHistory24h;
    } else if (timeFrame === "7d") {
      const discoveredHistory7d = await discoveredHistory7dModel.findOne(
        query,
        options
      );
      return discoveredHistory7d;
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getDiscoveredHistory = getDiscoveredHistory;

const insertNewDiscoveredHistory = async (timeFrame, data) => {
  try {
    if (timeFrame === "24h") {
      const discoveredHistory24h = new discoveredHistory24hModel(data);
      await discoveredHistory24h.save(function (
        err,
        newDiscoveredTokenHistory
      ) {
        if (err) return console.error(err);
        console.log(
          "newDiscoveredTokenHistory : " +
            newDiscoveredTokenHistory.token_id +
            " with timeFrame: " +
            timeFrame
        );
      });
    } else if (timeFrame === "7d") {
      const discoveredHistory7d = new discoveredHistory7dModel(data);
      await discoveredHistory7d.save(function (err, newDiscoveredTokenHistory) {
        if (err) return console.error(err);
        console.log(
          "newDiscoveredTokenHistory : " +
            newDiscoveredTokenHistory.token_id +
            " with timeFrame: " +
            timeFrame
        );
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.insertNewDiscoveredHistory = insertNewDiscoveredHistory;
