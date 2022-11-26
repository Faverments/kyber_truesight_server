// require("./connect_mongodb");
require("dotenv").config();
require("../models");
const { MONGODB_CONNECTION_STRING } = require("../config");
const mongoose = require("mongoose");
async function connect() {
  await mongoose.connect(MONGODB_CONNECTION_STRING);
  console.log("connect mongodb success");
}

const { MODELS, TIME_FRAME } = require("../constances");

const path = require("path");
const fs = require("fs");
const { sortFiles } = require("./shared");

const updatePredictedHistoryService = require("../services/updatePredictedHistory");

const folder = "data-production";
// data-production is local dev data folder
// process.env.NODE_ENV == "development" ? "data-production" : "data"; // use in remote server

async function run(timeFrame) {
  let dataPath;
  if (timeFrame === TIME_FRAME.DAY) {
    dataPath = path.join(__dirname, `../../${folder}/responseUpdate/24h`);
  } else if (timeFrame === TIME_FRAME.WEEK) {
    dataPath = path.join(__dirname, `../../${folder}/responseUpdate/7d`);
  }
  var files = fs.readdirSync(dataPath);
  const sortedFiles = sortFiles(files);
  for (let i = 0; i < sortedFiles.length; i++) {
    let file = sortedFiles[i];
    let data = fs.readFileSync(path.join(dataPath, file));
    let jsonData = JSON.parse(data);
    await updatePredictedHistoryService(timeFrame, jsonData);
    console.log("done with " + file);

    // throw new Error("stop");
  }
}
async function main() {
  try {
    await connect().catch((err) => console.log(err));
    await run(TIME_FRAME.DAY);
    await run(TIME_FRAME.WEEK);
    console.log("done");
  } catch (error) {
    console.log(error);
  }
}
main();
