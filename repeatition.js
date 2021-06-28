//Ex 2: Given an array of integers, find the most
//repetitions and repetitions.
//If multiple numbers have the same maximum number of
//iterations, export all of them.
//Maximum 3 rounds, not nested.
const findMaxRepetitionsArray = (arr) => {
  const result = arr.reduce(
    (currentResult, currentItem) => {
      const currentItemRepeatTime =
        currentResult.mapToCountRepeatTime[currentItem] === undefined
          ? 1
          : currentResult.mapToCountRepeatTime[currentItem] + 1;

      currentResult.mapToCountRepeatTime[currentItem] = currentItemRepeatTime;

      if (currentResult.maxRepeat <= currentItemRepeatTime) {
        if (currentResult.maxRepeat !== currentItemRepeatTime) {
          currentResult.maxList.length = 0;
        }

        currentResult.maxRepeat = currentItemRepeatTime;
        currentResult.maxList.push(currentItem);
      }

      return currentResult;
    },
    { maxRepeat: 0, maxList: [], mapToCountRepeatTime: {} }
  );
  return result.maxList;
};
console.log(findMaxRepeatitionsArray(array));
