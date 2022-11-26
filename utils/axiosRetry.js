const axios = require("axios");
const axiosRetry = require("axios-retry");
// axiosRetry(axios, {
//   retries: 5,
//   retryDelay: (retryCount) => {
//     console.log(`retry attempt: ${retryCount}`);
//     return retryCount * 2000;
//   },
//   // retryCondition: (error) => {
//   //     return error.response.status === 503;
//   // },
// });
module.exports = axios;
