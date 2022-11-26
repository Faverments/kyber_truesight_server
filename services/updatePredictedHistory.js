const {
  getPredictedHistory,
  insertNewPredictedHistory,
} = require("../controllers/predictedHistory");
module.exports = updatePredictedHistoryService = async (timeFrame, data) => {
  const arr = data.data.tokens;
  for (let i = 0; i < arr.length; i++) {
    const token = arr[i];
    const {
      token_id,
      order,
      rank,
      predicted_date,
      market_cap,
      number_holders,
      trading_volume,
      price,
      discovered_on,
      price_change_percentage_24h,
    } = token;
    const tokenHistory = await getPredictedHistory(timeFrame, { token_id }, {});
    if (tokenHistory) {
      tokenHistory.predicteds.push({
        order,
        rank,
        predicted_date,
        market_cap,
        number_holders,
        trading_volume,
        price,
        discovered_on,
        price_change_percentage_24h,
      });
      await tokenHistory.save(function (err, updatedTokenHistory) {
        if (err) return console.error(err);
        console.log("updatedTokenHistory : " + token_id);
      });
    } else {
      const newTokenHistory = { ...token };
      let deleteKey = [
        "order",
        "rank",
        "predicted_date",
        "market_cap",
        "number_holders",
        "trading_volume",
        "price",
        "discovered_on",
        price_change_percentage_24h,
      ];
      deleteKey.forEach((key) => {
        delete newTokenHistory[key];
      });
      newTokenHistory.predicteds = [
        {
          order,
          rank,
          predicted_date,
          market_cap,
          number_holders,
          trading_volume,
          price,
          discovered_on,
          price_change_percentage_24h,
        },
      ];
      await insertNewPredictedHistory(timeFrame, newTokenHistory);
    }
  }
};
