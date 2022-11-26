const {
  getDiscoveredHistory,
  insertNewDiscoveredHistory,
} = require("../controllers/discoveredHistory");

module.exports = updateDiscoveredHistoryService = async (timeFrame, data) => {
  const arr = data.data.tokens;
  for (let i = 0; i < arr.length; i++) {
    const token = arr[i];
    const {
      token_id,
      id_of_sources,
      name,
      symbol,
      discovered_details,
      discovered_on,
    } = token;
    if (discovered_on == 0) continue;
    const tokenHistory = await getDiscoveredHistory(
      timeFrame,
      { token_id },
      {}
    );
    if (tokenHistory) {
      tokenHistory.discovereds.push({
        discovered_details,
        discovered_on,
      });
      await tokenHistory.save(function (err, updatedTokenHistory) {
        if (err) return console.error(err);
        console.log("updatedDiscoveredTokenHistory : " + token_id);
      });
    } else {
      const newTokenHistory = {
        token_id,
        id_of_sources,
        name,
        symbol,
        discovereds: [
          {
            discovered_details,
            discovered_on,
          },
        ],
      };
      await insertNewDiscoveredHistory(timeFrame, newTokenHistory);
    }
  }
};
