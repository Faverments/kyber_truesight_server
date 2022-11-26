exports.WORKER_EVENTS = {};
exports.WORKER_TASK_DELAY = process.env.NODE_ENV == "development" ? 500 : 1000;
exports.COIN_GECKO_API = "https://api.coingecko.com/api/v3";
exports.MODELS = {
  COIN_GECKO_DATA: "CoinGeckoData",
  COIN_GECKO_TOKEN_LIST: "CoinGeckoTokenList",
};
