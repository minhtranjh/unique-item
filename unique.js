const array = [1, 1, 1, 2, 3, 4, 4, 5, 5];

const f1 = (arr) => {
  const newArr = [];
  arr.forEach((item) => {
    if (newArr.indexOf(item) < 0) {
      newArr.push(item);
    }
  });
  console.log(newArr);
};

const f2 = (arr) => {
  console.log([...new Set(arr)]);
};

const f3 = (arr) => {
  const newArr = [];
  arr.forEach((item, index) => {
    if (item !== arr[index + 1]) {
      newArr.push(item);
    }
  });
  console.log(newArr);
};


