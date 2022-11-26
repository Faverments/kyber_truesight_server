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
const TrueSightResponse24h = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_24H);
const TrueSightResponse7d = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_7D);
const trueSightFilter24h = mongoose.model(MODELS.TRUE_SIGHT_FILTER_24h);
const trueSightFilter7d = mongoose.model(MODELS.TRUE_SIGHT_FILTER_7d);

async function run(timeframe) {
  const listTokenDiscoverd = [];
  let trueSightResponse;
  let trueSightFilter;
  if (timeframe === "24h") {
    trueSightResponse = TrueSightResponse24h;
    trueSightFilter = trueSightFilter24h;
  }
  if (timeframe === "7d") {
    trueSightResponse = TrueSightResponse7d;
    trueSightFilter = trueSightFilter7d;
  }
  const data = await trueSightResponse.find({});
  const task = new Promise((resolve, reject) => {
    data.every(async (item, index, arr) => {
      // if (index > 0 && index < arr.length - 1) {
      //   return false;
      //   // disconnect mongodb
      // }
      const previousItem = arr[index - 1];
      const nextItem = arr[index + 1];
      const currentTokens = item.data.tokens;
      const previousTokens = previousItem ? previousItem.data.tokens : [];
      const nextTokens = nextItem ? nextItem.data.tokens : [];
      const insertData = {
        createAt: item.createAt,
        data: {
          total_number_tokens: item.data.total_number_tokens,
          tokens: JSON.parse(JSON.stringify(currentTokens)),
        },
      };

      currentTokens.forEach((token, i, tokens) => {
        insertData.data.tokens[i].filter = [];
        // check if token is in previousTokens
        const previousToken = previousTokens.find((previosToken) => {
          return previosToken.token_id === token.token_id;
        });
        if (previousToken) {
          insertData.data.tokens[i].filter.push(FILTER.PREVIOUS_PREDICTED);
        }
        // check if token is in nextTokens
        const nextToken = nextTokens.find((nextToken) => {
          return nextToken.token_id === token.token_id;
        });
        if (nextToken) {
          insertData.data.tokens[i].filter.push(FILTER.NEXT_PREDICTED);
        }

        // check if token is not in listTokenDiscoverd
        const discoveredToken = listTokenDiscoverd.find(
          (discoveredToken) => discoveredToken.token_id === token.token_id
        );

        if (index === 0) {
        } else {
          if (discoveredToken) {
            if (discoveredToken.discovered_on !== token.discovered_on) {
              // discovered_on change
              insertData.data.tokens[i].filter.push(
                FILTER.DISCOVERED_DATE_CHANGE
              );
            }
          } else {
            // new discovered token
            insertData.data.tokens[i].filter.push(FILTER.NEW_DISCOVERED);
          }
        }
      });

      // save data into local
      // fs.writeFileSync(
      //   __dirname + `/data/data${index}.json`,
      //   JSON.stringify(insertData, null, 2)
      // );
      // ERROR WHEN USE AWAIT , AUTO ADD NEW_DISCOVERED IN FILTER ARRAY ???????? ************************** --> No_Error because sort default mongo compass
      trueSightFilter
        .insertMany(JSON.parse(JSON.stringify(insertData)))
        .then((res) => {
          // console.log(res[0]);
          fs.writeFileSync(
            __dirname + `/data_mongo/data${index}.json`,
            JSON.stringify(res[0], null, 2)
          );
          console.log("success");
        });
      console.log("run");

      currentTokens.forEach((token) => {
        let discoveredTokenIndex = listTokenDiscoverd.findIndex(
          (discoveredToken) => discoveredToken.token_id === token.token_id
        );
        if (discoveredTokenIndex === -1) {
          listTokenDiscoverd.push(JSON.parse(JSON.stringify(token)));
        } else {
          listTokenDiscoverd[discoveredTokenIndex] = JSON.parse(
            JSON.stringify(token)
          );
        }
      });
      // return true;

      if (index == arr.length - 1) {
        resolve("done");
      }
    });
  });
  await task;
  fs.writeFileSync(
    __dirname + `/listTokenDiscoverd.json`,
    JSON.stringify(listTokenDiscoverd, null, 2)
  );
}

async function main() {
  try {
    await connect().catch((err) => console.log(err));
    // await run("24h");
    await run("7d");
    console.log("done");
  } catch (error) {
    console.log(error);
  }
}
main();
