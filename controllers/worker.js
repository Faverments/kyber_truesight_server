const mongoose = require("mongoose");
const workerManager = require("../workers/emitter/contructor");
const { MODELS } = require("../workers/constances");

const coinGeckoTokenList = mongoose.model(MODELS.COIN_GECKO_TOKEN_LIST);

exports.insertListToken = async () => {
  try {
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
exports.updateListToken = async () => {};

exports.insertCoinGeckoTokenData = async () => {
  try {
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
