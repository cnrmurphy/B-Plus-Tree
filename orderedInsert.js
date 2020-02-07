const binarySearch = require('./binarySearch');

// orderedInsert inserts a given value into a given array while retaining
// the order of the array. We mutate on the array rather than creating
// a new array in memory. We use a small opitmizaton to determine if
// we can directly insert to the end or start of the array.
const orderedInsert = (arr, val) => {
  // TODO: foundIndex can be used to handle duplicate insertions. At this time we
  // ignore the foundIndex and choose to do nothing with duplicate indexes
  const [foundIndex, insertIndex] = binarySearch(arr, val);
  if (insertIndex > arr.length - 1) {
    arr.push(val);
  } else if (insertIndex === 0) {
    arr.unshift(val); 
  } else {
    arr.push(null);
    let previousVal = arr[insertIndex];
    arr[insertIndex] = val;
    for (let i = insertIndex+1; i < arr.length; ++i) {
      let temp = previousVal;
      previousVal = arr[i];
      arr[i] = temp;
    }
  }
  return insertIndex;
};

module.exports = orderedInsert;
