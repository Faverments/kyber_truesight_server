const path = require("path");
const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DATABASE =
  // process.env.NODE_ENV == "development" ? "test" : "kyber-monitor";
  process.env.NODE_ENV == "development" ? "kyber-monitor" : "test"; // reverse because don't set database in last commit
// process.env.NODE_ENV == "development" ? "test" : "test"; // dev on production data
const MONGODB_AUTH_PARAMS = process.env.MONGODB_AUTH_PARAMS;
const MONGODB_ATLAS_PARAMS = process.env.MONGODB_ATLAS_PARAMS;
const MONGODB_CERT = path.resolve(
  __dirname,
  "./security/mongodb-do-ca-certificate.crt"
);
exports.MONGODB_CONNECTION_STRING =
  process.env.MONGODB_URL_ATLAS + MONGODB_DATABASE + MONGODB_ATLAS_PARAMS;
// MONGODB_URL + MONGODB_DATABASE + MONGODB_AUTH_PARAMS + MONGODB_CERT;
exports.CLIENT_ID = process.env.CLIENT_ID;
exports.PROJECT_ID = process.env.PROJECT_ID;
exports.AUTH_URI = process.env.AUTH_URI;
exports.TOKEN_URI = process.env.TOKEN_URI;
exports.AUTH_PROVIDER_X509_CERT_URL = process.env.AUTH_PROVIDER_X509_CERT_URL;
exports.CLIENT_SECRET = process.env.CLIENT_SECRET;
exports.REDIRECT_URL = ["http://localhost:3000"];
