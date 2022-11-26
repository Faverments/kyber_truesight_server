require("dotenv").config();
require("../models");
const { MONGODB_CONNECTION_STRING } = require("../config");
const mongoose = require("mongoose");
async function connect() {
  await mongoose.connect(MONGODB_CONNECTION_STRING);
  console.log("connect mongodb success");
}
connect().catch((err) => console.log(err));
