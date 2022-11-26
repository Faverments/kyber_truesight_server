const { delay } = require("./utils");

function isPromise(promise) {
  return !!promise && typeof promise.then === "function";
}

async function goto(
  callback,
  condition,
  { retryAmount, retryDelayTime, errMessage, retryMessage }
) {
  let resResultGlobal = null;
  function retryDelay(retryCount) {
    console.log(`${retryMessage || "retry "} attempt : ${retryCount}`);
    return retryCount * retryDelayTime; // time interval between retries
  }
  var i = 0;
  var check = false;
  start: while (true) {
    if (i > 0) {
      await delay(retryDelay(i));
    }
    const result = await callback();
    resResultGlobal = result;
    // conditionResult if true => retry
    const conditionResult = await condition(result);
    i++;
    if (i < retryAmount && conditionResult) continue start;
    if (i == retryAmount) {
      check = true;
    }
    break;
  }
  if (check) {
    throw new Error(
      (errMessage || `Failed to retry `) + `after ${retryAmount} attempts`
    );
  }
  return resResultGlobal;
}
module.exports = goto;
