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

const trueSightFilter24h = mongoose.model(MODELS.TRUE_SIGHT_FILTER_24h);
const trueSightFilter7d = mongoose.model(MODELS.TRUE_SIGHT_FILTER_7d);

async function run(timeframe) {
  // IN_DEV
}

async function main() {
  try {
    await connect().catch((err) => console.log(err));
    await run("24h");
    await run("7d");
    console.log("done");
  } catch (error) {
    console.log(error);
  }
}
main();
