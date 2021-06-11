const array = [1, 2, 3, 3, 4, 4, 5];
//Ex 2: Given an array of integers, find the most
//repetitions and repetitions.
//If multiple numbers have the same maximum number of
//iterations, export all of them.
//Maximum 3 rounds, not nested.

const findMaxRepeatitionsArray = (arr) => {
  let flagRepetition = {};
  let flagIndex = {};
  let index = 0;
  let maxValue = 0;
  const maxArr = [];
  arr.reduce((newArr, item) => {
    flagRepetition[item] =
      flagRepetition[item] === undefined ? 1 : flagRepetition[item] + 1;
    if (flagRepetition[item] === 1) {
      newArr.push({ value: item, repetitions: 1 });
      flagIndex[item] = index++;
    }
    newArr[flagIndex[item]].repetitions = flagRepetition[item];
    if (maxValue <= newArr[flagIndex[item]].repetitions) {
      if (maxValue !== newArr[flagIndex[item]].repetitions) maxArr.length = 0;
      maxValue = newArr[flagIndex[item]].repetitions;
      maxArr.push(newArr[flagIndex[item]]);
    }
    return newArr;
  }, []);
  return maxArr;
};
console.log(findMaxRepeatitionsArray(array));
