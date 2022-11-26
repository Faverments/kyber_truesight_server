function sortFiles(files) {
  files = files.map((value) => {
    return value.split(".")[0];
  });
  let newFiles = files.map((value, index) => {
    let softIndex = value.split("data")[1];
    return {
      value,
      softIndex: Number(softIndex),
    };
  });
  let sortedFiles = newFiles.sort((a, b) => {
    return a.softIndex - b.softIndex;
  });
  let result = sortedFiles.map((value) => {
    return value.value;
  });
  result = result.map((value) => {
    return value + ".json";
  });
  return result;
}
module.exports = {
  sortFiles,
};
