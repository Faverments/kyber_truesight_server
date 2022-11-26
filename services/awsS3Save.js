// Load the SDK and UUID
var AWS = require("aws-sdk");
var uuid = require("uuid");
var bucketName = "kyber-sync";

function save(type, timeFrame, data) {
  const keyName = `${type}/${timeFrame}/${new Date().getTime()}-${uuid.v4()}.json`;
  const objectParams = {
    Bucket: bucketName,
    Key: keyName,
    Body: JSON.stringify(data),
    ContentEncoding: "base64",
    ContentType: "application/json",
    // with kyber-sync bucket (create by UI) not allow ??????????
    // ACL: "public-read",
  };
  const uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
    .putObject(objectParams)
    .promise();
  uploadPromise.then(function (data) {
    console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
  });
}

exports.awsS3SaveTrueSightService = async (timeFrame, data) => {
  save("truesight", timeFrame, data);
};
exports.awsS3SaveTrendingService = async (timeFrame, data) => {
  save("trending", timeFrame, data);
};
