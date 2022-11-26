const { WORKER_TASK_DELAY, COIN_GECKO_API } = require("../constances");
const { setAsyncInterval, clearAsyncInterval, axios } = require("../../utils");

async function fetchData(limit = 250) {
  return await axios
    .get(
      `
  ${COIN_GECKO_API}/coins/markets?vs_currency=usd&per_page=${limit}`
    )
    .then((res) => res.data)
    .catch(function (error) {
      console.log(error);
      return undefined;
    });
}

async function worker() {
  async function task() {
    const data = await fetchData();
    if (data) {
    }
  }
  setAsyncInterval(task, WORKER_TASK_DELAY);
}

async function startCoinGeckoWorker() {
  await worker();
}
module.exports = {
  startCoinGeckoWorker,
};
