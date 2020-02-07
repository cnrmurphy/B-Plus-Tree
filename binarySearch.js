// binarySearch takes an array and a value of any type. It searches
// the array for the index of the given value. If it does not find the value
// it will return the index for which it would be found. It returns an array
// containing either the found index or the index at which the value would be found.
// [foundIndex, insertIndex] either value will be null for which one is not found.
const binarySearch = (arr, val) => {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left)/2);
    if (arr[mid] === val) {
      return [mid, null];
    } else if (val < arr[mid]) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return [null, left];
}

module.exports = binarySearch;