const {
  getAllDiscoveredTokenIds,
  getLastTrueSightFilter,
  insertNewTrueSightFilter,
} = require("../controllers/trueSightFilter");
const {
  addLastPredictedHistory,
  addDiscoveredDetails,
} = require("../controllers/trueSightTableDetails");

const { MODELS, FILTER } = require("../constances");

async function modifyTrueSightFilterData(timeFrame, data) {
  const dataWithLastPredictedHistory = await addLastPredictedHistory(
    timeFrame,
    data
  );
  const dataWithDiscoveredFromTrendingData = await addDiscoveredDetails(
    timeFrame,
    dataWithLastPredictedHistory
  );
  return dataWithDiscoveredFromTrendingData;
}

// In this timestamp this is previous response ( current in last predicted, last document in mongodb)
async function updatePreviousTrueSightFilter(timeFrame, data) {
  const lastTrueSightFilterResponse = await getLastTrueSightFilter(timeFrame);
  const currentTokens = lastTrueSightFilterResponse.data.tokens;
  const nextTokens = data.data.tokens;

  currentTokens.forEach((token, i, tokens) => {
    // check if token is in nextTokens
    const nextToken = nextTokens.find(
      (nextToken) => nextToken.token_id === token.token_id
    );
    if (nextToken) {
      lastTrueSightFilterResponse.data.tokens[i].filter.push(
        FILTER.NEXT_PREDICTED
      );
      console.log("nextToken : ", lastTrueSightFilterResponse._id);
    }
  });
  await lastTrueSightFilterResponse.save(function (err) {
    if (err) return console.error(err);
    console.log(
      "update trueSight filter success with id  : " +
        lastTrueSightFilterResponse._id +
        "with timeFrame: " +
        timeFrame
    );
  });
}

// In this timestamp this is current response
async function insertCurrentTrueSightFilter(timeFrame, dataIncome) {
  const currentTokens = dataIncome.data.tokens;
  const previousResponse = await getLastTrueSightFilter(timeFrame);
  const previousTokens = previousResponse.data.tokens;
  const listTokenDiscovered = await getAllDiscoveredTokenIds(timeFrame);
  currentTokens.map((token, i, tokens) => {
    dataIncome.data.tokens[i].filter = [];
    // check if token is in previousTokens
    const previousToken = previousTokens.find((previousToken) => {
      return previousToken.token_id === token.token_id;
    });
    if (previousToken) {
      dataIncome.data.tokens[i].filter.push(FILTER.PREVIOUS_PREDICTED);
      console.log("previousToken : ( + 1 ) ", previousResponse._id);
    }

    // check if token is not in listTokenDiscoverd
    const discoveredToken = listTokenDiscovered.find(
      (discoveredToken) => discoveredToken.token_id === token.token_id
    );

    if (discoveredToken) {
      if (
        // check predicteds đã cập nhập chưa nếu chưa cập nhập lấy cuối, nếu cập nhập rồi thì lấy gần cuối, IN_DEV
        // -> update trueSightFilter trước update predictedHistory
        discoveredToken.predicteds[discoveredToken.predicteds.length - 1]
          .discovered_on !== token.discovered_on
      ) {
        // discovered_on change
        dataIncome.data.tokens[i].filter.push(FILTER.DISCOVERED_DATE_CHANGE);
        console.log(
          "discoveredToken change date : ( + 2 ) ",
          discoveredToken.token_id
        );
      }
    } else {
      // new discovered token
      dataIncome.data.tokens[i].filter.push(FILTER.NEW_DISCOVERED);
      console.log("new discovered token : ", token.token_id);
    }
  });
  const insertData = await modifyTrueSightFilterData(timeFrame, dataIncome);
  await insertNewTrueSightFilter(timeFrame, insertData);
}

module.exports = updateTrueSightFilterService = async (timeFrame, data) => {
  // update previous response
  await updatePreviousTrueSightFilter(timeFrame, data);
  // update current response
  await insertCurrentTrueSightFilter(timeFrame, data);
};
