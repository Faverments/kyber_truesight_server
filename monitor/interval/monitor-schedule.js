const schedule = require("node-schedule");
const axios = require("axios").default;
const { NEXT_PREDICTED_TIME, TRUE_SIGHT_API } = require("../constances");
async function fetchData(dateType) {
  return await axios
    .get(
      `${TRUE_SIGHT_API}/api/v1/trending-soon?timeframe=${dateType}&page_number=0&page_size=100&search_token_name&search_token_tag`
    )
    .then((res) => res.data)
    .catch(function (error) {
      console.log(error.message);
      return undefined;
    });
}

async function getPrediction(dateType) {
  let response = await fetchData(dateType);
  let currentPredictedDate = response.data.tokens[0].predicted_date;
  const nextPredictedDate = currentPredictedDate * 1000 + NEXT_PREDICTED_TIME;
  return {
    nextPredictedDate,
    response,
  };
}

async function recursiveJov(data, dateType) {
  console.log(data);
  const job = schedule.scheduleJob(data.nextPredictedDate, async () => {
    // let nextData = await getPrediction(dateType);
    // recursiveJov(nextData, dateType);
    console.log("run");
  });
}

async function main() {
  let data24h = await getPrediction("24h");
  await recursiveJov(data24h, "24h");
}
// main();
