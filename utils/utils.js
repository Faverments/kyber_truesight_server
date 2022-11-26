function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function rn(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setIntervalImmediately(func, interval) {
  func();
  return setInterval(func, interval);
}

const asyncIntervals = [];

const runAsyncInterval = async (cb, interval, intervalIndex) => {
  await cb();
  if (asyncIntervals[intervalIndex].run) {
    asyncIntervals[intervalIndex].id = setTimeout(
      () => runAsyncInterval(cb, interval, intervalIndex),
      interval
    );
  }
};

const setAsyncInterval = (cb, interval) => {
  if (cb && typeof cb === "function") {
    const intervalIndex = asyncIntervals.length;
    asyncIntervals.push({ run: true, id: 0 });
    runAsyncInterval(cb, interval, intervalIndex);
    return intervalIndex;
  } else {
    throw new Error("Callback must be a function");
  }
};

const clearAsyncInterval = (intervalIndex) => {
  if (asyncIntervals[intervalIndex].run) {
    clearTimeout(asyncIntervals[intervalIndex].id);
    asyncIntervals[intervalIndex].run = false;
  }
};

module.exports = {
  delay,
  rn,
  setIntervalImmediately,
  setAsyncInterval,
  clearAsyncInterval,
};
