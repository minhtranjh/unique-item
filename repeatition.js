const array = [1, 1,1, 1, 2, 2, 2, 3, 3, 5, 5, 5];
//Ex 2: Given an array of integers, find the most
//repetitions and repetitions.
//If multiple numbers have the same maximum number of
//iterations, export all of them.
//Maximum 3 rounds, not nested.

const findMaxRepeatitionsArray = (arr) => {
  let flagRepetition = {};
  let flagIndex = {};
  let index = 0;
  let newArr = [];
  let maxValue = 0;
  const maxArr = [];
  for (let i = 0; i < arr.length; i++) {
      flagRepetition[arr[i]] =
        flagRepetition[arr[i]] === undefined ? 1 : flagRepetition[arr[i]] + 1;
      if (flagRepetition[arr[i]] >= 1) {
        if (flagRepetition[arr[i]] === 1) {
          newArr.push({
            value: arr[i],
            repetitions: 1,
          });
          flagIndex[arr[i]] = index++;
        }
        newArr[flagIndex[arr[i]]].repetitions = flagRepetition[arr[i]];
        if (maxValue <= newArr[flagIndex[arr[i]]].repetitions) {
          if (maxValue === newArr[flagIndex[arr[i]]].repetitions) {
            maxValue = newArr[flagIndex[arr[i]]].repetitions;
            maxArr.push(newArr[flagIndex[arr[i]]]);
          } else {
            maxArr.length = 0;
            maxValue = newArr[flagIndex[arr[i]]].repetitions;
            maxArr.push(newArr[flagIndex[arr[i]]]);
          }
        }
      }
    }
  return maxArr;
};
console.log(findMaxRepeatitionsArray(array));
