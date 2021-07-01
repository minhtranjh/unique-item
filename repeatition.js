const array = [1, 2, 3, 3, 3, 3, 3, 4,4,4,4, 4, 5,5,5,5,5,5,5];
//Ex 2: Given an array of integers, find the most
//repetitions and repetitions.
//If multiple numbers have the same maximum number of
//iterations, export all of them.
//Maximum 3 rounds, not nested.
const findMaxRepeatitionsArray = (arr) => {
  const result = arr.reduce(
    (acc, item) => {
      acc.repeatList[item] =
        acc.repeatList[item] === undefined ? 1 : acc.repeatList[item] + 1;
      acc.repeatList[item] = acc.repeatList[item];
      if (acc.max <= acc.repeatList[item]) {
        if (acc.max !== acc.repeatList[item]) acc.maxList.length = 0;
        acc.max = acc.repeatList[item];
        acc.maxList.push({ value: item, repeatition: acc.repeatList[item] });
      }
      return acc;
    },
    { max: 0, maxList: [], repeatList: {} }
  );
  return result.maxList;
};
console.log(findMaxRepeatitionsArray(array));
