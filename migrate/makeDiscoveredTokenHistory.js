require("dotenv").config();
const fs = require("fs");
require("../models");
const { MONGODB_CONNECTION_STRING } = require("../config");
const mongoose = require("mongoose");
let db;
async function connect() {
  db = await mongoose.connect(MONGODB_CONNECTION_STRING);
  console.log("connect mongodb success");
}

const { MODELS, FILTER } = require("../constances");
const {
  getDiscoveredHistory,
  insertNewDiscoveredHistory,
} = require("../controllers/discoveredHistory");

const TrendingResponse24h = mongoose.model(MODELS.TRENDING_RESPONSE_24H);
const TrendingResponse7d = mongoose.model(MODELS.TRENDING_RESPONSE_7D);
const DiscoveredHistory24h = mongoose.model(MODELS.DISCOVERED_HISTORY_24h);
const DiscoveredHistory7d = mongoose.model(MODELS.DISCOVERED_HISTORY_7d);

async function run(timeFrame) {
  let trendingResponse;
  if (timeFrame === "24h") {
    trendingResponse = TrendingResponse24h;
  }
  if (timeFrame === "7d") {
    trendingResponse = TrendingResponse7d;
  }
  const data = await trendingResponse.find({});
  const task = new Promise((resolve, reject) => {
    data.every(async (eachTrendingResponse, index, self) => {
      // if (index > 1 && index < self.length) {
      //   //only run for first 2 item
      //   // disconnect mongoose
      //   return false;
      // }
      console.log("run at index: ", index);
      console.log("run at _id = ", eachTrendingResponse._id);
      const arr = eachTrendingResponse.data.tokens;
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

      return true;
    });
  });
  await task;
}

async function main() {
  try {
    await connect().catch((err) => console.log(err));
    await run("24h");
    await run("7d");
    // db.disconnect((err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log("disconnect mongodb success");
    // });
    console.log("done");
  } catch (error) {
    console.log(error);
  }
}
main();
