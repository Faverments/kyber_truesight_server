// require("../migrate/connect_mongodb");
const { TIME_FRAME } = require("../constances");
const {
  getListTrueSightResponseWarper,
} = require("../controllers/predictedDate");
const {
  getListTokenWithLastPredictedHistory,
} = require("../controllers/trueSightTableDetails");

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;
const PERIOD_TIME = {
  HALF_DAY: 12 * ONE_HOUR,
  ONE_DAY: ONE_DAY,
  TWO_DAY: 2 * ONE_DAY,
  THREE_DAY: 3 * ONE_DAY,
  FOUR_DAY: 4 * ONE_DAY,
  FIVE_DAY: 5 * ONE_DAY,
  SIX_DAY: 6 * ONE_DAY,
  SEVEN_DAY: 7 * ONE_DAY,
};
// console.log(PERIOD_TIME);

// IN_DEV PERIOD_TIME PICKER
async function updatePeriodTime(timeFrame, data, timeStamps) {
  const listTrueSightResponse = await getListTrueSightResponseWarper(timeFrame);
  const listPredictedDate = listTrueSightResponse.map((dateArr) => {
    const mediumDate = Math.floor(
      dateArr.reduce((a, b) => a + b, 0) / dateArr.length
    );
    const predictedDate = new Date(mediumDate * 1000);
  });
  console.log(listPredictedDate);
}

exports.updateLastPredictedDetailsInCurrentPredicted =
  async function updateLastPredictedDetailsInCurrentPredicted(
    timeFrame,
    data,
    timeStamps
  ) {};

async function updateDiscoveredPriceAndVolume(timeFrame, data, timeStamps) {}
exports.updateTrueSightTableDetails = async (timeFrame, data, timeStamps) => {};
// updateTrueSightTableDetails(TIME_FRAME.DAY, null, Date.now());
