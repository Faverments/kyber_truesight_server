require("dotenv").config();
require("../models/predictedHistory");
const { MONGODB_CONNECTION_STRING } = require("../config");
const mongoose = require("mongoose");
async function connect() {
  await mongoose.connect(MONGODB_CONNECTION_STRING);
  console.log("connect mongodb success");
}
connect().catch((err) => console.log(err));

const { MODELS, TIME_FRAME } = require("../constances");
const predictHistory24hModel = mongoose.model(MODELS.PREDICTED_HISTORY_24h);
const predictHistory7dModel = mongoose.model(MODELS.PREDICTED_HISTORY_7d);

const path = require("path");
const fs = require("fs");

const dataPath = path.join(__dirname, "../../data/predict");

function insertData(timeFrame, data) {
  if (timeFrame === "24h") {
    predictHistory24hModel.insertMany(data, (err, docs) => {
      if (err) {
        console.log(err);
      } else {
        console.log("insert success");
      }
    });
  } else if (timeFrame === "7d") {
    predictHistory7dModel.insertMany(data, (err, docs) => {
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
    let data24h = JSON.parse(
      fs.readFileSync(path.join(dataPath, "resData24h.json"))
    );
    let data7d = JSON.parse(
      fs.readFileSync(path.join(dataPath, "resData7d.json"))
    );
    data24h.forEach((element) => {
      insertData(TIME_FRAME.DAY, element);
    });
    data7d.forEach((element) => {
      insertData(TIME_FRAME.WEEK, element);
    });

    // throw new Error("stop");
  } catch (error) {
    console.log(error);
  }
}
main();
