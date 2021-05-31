const array = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 5, 5];
//Ex 2: Given an array of integers, find the most
//repetitions and repetitions.
//If multiple numbers have the same maximum number of
//iterations, export all of them.
//Maximum 3 rounds, not nested.

const removeDuplicates = (arr) => {
  let flag = {};
  let seen = {};

  
  //1 Round
  const newArr = arr.reduce((tempArr, item, index) => {
    if (flag[item] === undefined || flag[item] > 0) {
      flag[item] = flag[item] == undefined ? 1 : flag[item] + 1;
      if (seen[item] !== 1) {
        seen[item] = 1;
        return [
          ...tempArr,
          {
            value: item,
            repeatitions: 1,
          },
        ];
      }
    }
    return tempArr;
  }, []);


  //2 Round
  let maxArr = [];
  let maxValue = newArr[0].repeatitions;
  newArr.forEach((item, index) => {
    newArr[index].repeatitions = flag[item.value];
    if (newArr[index].repeatitions >= maxValue) {
      if (newArr[index].repeatitions > maxValue) {
        maxValue = newArr[index].repeatitions;
        maxArr.length = 0;
      }
      maxArr.push(newArr[index]);
    }
  });
  return maxArr;
};

removeDuplicates(array);
