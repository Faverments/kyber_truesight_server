const path = require("path");
const fs = require("fs");
const { sortFiles } = require("../migrate/shared");
const { TIME_FRAME } = require("../constances");

async function saveData(dirPath, data) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  var files = fs.readdirSync(dirPath);
  const sortedFiles = sortFiles(files);
  const lastFile = sortedFiles[sortedFiles.length - 1];
  let fileName;
  if (lastFile) {
    const next = parseInt(lastFile.match(/\d+/g)) + 1;
    fileName = `data${next}.json`;
  } else fileName = `data0.json`;
  const filePath = path.join(dirPath, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

exports.jsonSaveService = async (timeFrame, data) => {
  // jsonSaveService = async (timeFrame, data) => {
  const dirPath = path.join(
    __dirname,
    "../../data/responseUpdate/" + timeFrame
  );
  await saveData(dirPath, data);
};
// jsonSaveService()

exports.jsonSaveTrendingService = async (timeFrame, data) => {
  const trendingDirPath = path.join(
    __dirname,
    "../../data/trending/" + timeFrame
  );
  await saveData(trendingDirPath, data);
};
