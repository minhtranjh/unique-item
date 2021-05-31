const array = [1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 4, 5, 5];

const convertToUnique1 = (arr) => {
  const newArr = [];
  arr.forEach((item) => {
    if (newArr.indexOf(item) < 0) {
      newArr.push(item);
    }
  });
  return newArr;
};

const convertToUnique2 = (arr) => {
  return [...new Set(arr)];
};

const convertToUnique3 = (arr) => {
  const newArr = [];
  arr.forEach((item, index) => {
    if (item !== arr[index + 1]) {
      newArr.push(item);
    }
  });
  return newArr;
};

const convertToUnique4 = (arr) => {
  const newArr = arr.reduce((tempArr, item) => {
    if (!tempArr.includes(item)) {
      return [...tempArr, item];
    }
    return tempArr;
  }, []);
  return newArr;
};

const convertToUnique5 = (arr) => {
  let flag = {};
  const newArr = [];
  arr.forEach((item) => {
    if (flag[item] !== 1) {
      flag[item] = 1;
      newArr.push(item);
    }
  });
  return newArr;
};

const convertToUnique6 = (arr) => {
  const mapObject = new Map(arr.map((x) => [x, x])).values();
  console.log(mapObject);
  return [...mapObject];
};

