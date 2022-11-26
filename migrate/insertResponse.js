require("dotenv").config();
require("../models/trueSightResponde");
const { MONGODB_CONNECTION_STRING } = require("../config");
const mongoose = require("mongoose");
async function connect() {
  await mongoose.connect(MONGODB_CONNECTION_STRING);
  console.log("connect mongodb success");
}
connect().catch((err) => console.log(err));

const { MODELS } = require("../monitor/constances");
const TrueSightResponse24h = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_24H);
const TrueSightResponse7d = mongoose.model(MODELS.TRUE_SIGHT_RESPONSE_7D);

const path = require("path");
const fs = require("fs");
const { sortFiles } = require("./shared");

const dataPath = path.join(__dirname, "../../data/response");
var files = fs.readdirSync(dataPath);
const sortedFiles = sortFiles(files);

function insertData(timeFrame, data) {
  if (timeFrame === "24h") {
    TrueSightResponse24h.insertMany(data, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log("insert success");
      }
    });
  } else if (timeFrame === "7d") {
    TrueSightResponse7d.insertMany(data, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log("insert success");
      }
    });
  }
}

function main() {
  try {
    sortedFiles.forEach((file) => {
      let data = fs.readFileSync(path.join(dataPath, file));
      let jsonData = JSON.parse(data);
      const { data24h, data7d } = jsonData;
      insertData("24h", data24h);
      insertData("7d", data7d);

      // throw new Error("stop");
    });
  } catch (error) {
    console.log(error);
  }
}
main();
