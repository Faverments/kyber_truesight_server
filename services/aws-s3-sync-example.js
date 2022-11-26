// Load the SDK and UUID
var AWS = require("aws-sdk");
var uuid = require("uuid");

// Create unique bucket name
var bucketName = "node-sdk-sample-45692a7f-8ab5-42a7-a42f-2c28917b7fef";
// Create name for uploaded object key
var keyName = "trending-24hf/token-dont-need-file.json";

// Create a promise on S3 service object\

var objectParams = {
  Bucket: bucketName,
  Key: keyName,
  Body: JSON.stringify({
    id: uuid.v1(),
    name: "hello world",
  }),
  ContentEncoding: "base64",
  ContentType: "application/json",
  ACL: "public-read",
};
// Create object upload promise
var uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
  .putObject(objectParams)
  .promise();
uploadPromise.then(function (data) {
  console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
});

// // Load the AWS SDK for Node.js
// var AWS = require("aws-sdk");
// // Set the region
// AWS.config.update({ region: "us-east-2" });

// // Create S3 service object
// var s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// // call S3 to retrieve upload file to specified bucket
// var uploadParams = {
//   Bucket: "node-sdk-sample-45692a7f-8ab5-42a7-a42f-2c28917b7fef",
//   Key: "",
//   Body: "",
//   ContentEncoding: "base64",
//   ContentType: "application/json",
//   ACL: "public-read",
// };
// var file = __dirname + "/token.json";

// // Configure the file stream and obtain the upload parameters
// var fs = require("fs");
// var fileStream = fs.createReadStream(file);
// fileStream.on("error", function (err) {
//   console.log("File Error", err);
// });
// uploadParams.Body = fileStream;
// var path = require("path");
// uploadParams.Key = path.basename(file);

// // call S3 to retrieve upload file to specified bucket
// s3.upload(uploadParams, function (err, data) {
//   console.log(uploadParams);
//   if (err) {
//     console.log("Error", err);
//   }
//   if (data) {
//     console.log("Upload Success", data.Location);
//   }
// });
