var fs = require("fs");
var util = require("util");
const path = require("path");
const logsPath = path.resolve(__dirname, "./logs");
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath, { recursive: true });
}
var logFile = fs.createWriteStream(logsPath + "/log.txt", {
  flags: "a",
});
// Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + "\n");
  logStdout.write(util.format.apply(null, arguments) + "\n");
};
console.error = console.log;
