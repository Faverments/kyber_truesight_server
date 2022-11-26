// IN_DEV ( WILL NEED WHEN BUILD HISTORY PAGE)

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
