const array = [1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 3, 4, 4, 2, 4, 5, 5];
//Ex 2: Given an array of integers, find the most
//repetitions and repetitions.
//If multiple numbers have the same maximum number of
//iterations, export all of them.
//Maximum 3 rounds, not nested.

const removeDuplicates = (arr) => {
  let flagRepetition = {};
  let flagIndex = {};
  let index = 0;
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (flagRepetition[arr[i]] === undefined || flagRepetition[arr[i]] > 0) {
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
      }
    }
  }

  return newArr;
};

console.log(removeDuplicates(array));
