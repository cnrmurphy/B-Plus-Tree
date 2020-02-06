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
}

class Node {
  constructor(m) {
    this.isLeaf = true;
    this.keys = [];
    this.pointers = [];
    this.size = 0;
    this.m = m;
    this.nextNode = null;
    this.parent = null;
  }

  isFull() {
    return this.keys.length === this.m;
  }

  insert(key) {
    if (this.isFull()) {
      return this.split(key);
    } else {
      orderedInsert(this.keys, key);
      return [null, null];
    }
  }

  hasParent() {
    return this.parent != undefined;
  }

  // Split takes a new key to be insert and divides
  // the key array in half. It returns an array containing
  // the new root key and right half of the split keys
  split(newKey) {
    orderedInsert(this.keys, newKey);
    // middle value of array becomes new root key
    // leaf nodes retain root key value when splits.
    // internal nodes do not retain the root key value.
    let newRootKey = this.keys[Math.floor(this.keys.length/2)];
    if (this.isLeaf) {
      let splitKeys = this.keys.splice(this.keys.length / 2, this.keys.length - 1);
      return [newRootKey, splitKeys, null];
    } else {
      let splitIndex = Math.floor(this.keys.length/2)+1;
      let splitKeys = this.keys.splice(splitIndex, this.keys.length - 1);
      this.keys.pop();
      return [newRootKey, splitKeys, splitIndex];
    }
  }
}

class BPTree {
  constructor(m, root) {
    this.root = root;
    this.m = m;
  }
  insert(key) {
    if (!this.root) {
      this.root = new Node(this.m);
      this.root.insert(key);
    } else {
      let n = this.findLeafNode(key, this.root);
      if (n.isFull()) {
        let [newRootKey, splitKeys] = n.insert(key);
        let newNode = new Node(this.m);
        newNode.keys = splitKeys;
        newNode.parent = n.parent;
        n.nextNode = newNode;
        this.parentInsert(newRootKey, n, newNode);
      } else {
        n.insert(key);
      }
    }
  }
  parentInsert(key, leftNode, rightNode) {
    let parent = leftNode.parent;
    if (parent) {
      if (parent.isFull()) {
        let [newRootKey, splitKeys, splitIndex] = parent.insert(key);
        let internalNode = new Node(this.m);
        internalNode.keys = splitKeys;
        internalNode.pointers = parent.pointers.splice(splitIndex, parent.pointers.length - 1);
        internalNode.pointers[0].parent = internalNode;
        internalNode.isLeaf = false;
        internalNode.pointers.push(rightNode);

        rightNode.parent = internalNode;
        parent.isLeaf = false;
        if (parent.hasParent()) {
          return this.parentInsert(newRootKey, parent, internalNode);
        } else {
          this.makeRootNode(newRootKey, parent, internalNode);
        }
      } else {
        // if the immediate parent is not full, add the new key and pointer to new child
        rightNode.parent = parent;
        parent.insert(key);
        parent.pointers.push(rightNode);
      }
    } else {
      this.makeRootNode(key, leftNode, rightNode);
    }
  }
  makeRootNode(key, leftPointer, rightPointer) {
    let rn = new Node(this.m);
    rn.isLeaf = false;
    rn.insert(key);
    rn.pointers.push(leftPointer, rightPointer);
    leftPointer.parent = rn;
    rightPointer.parent = rn;
    this.root = rn;
  }
  findLeafNode(key, node) {
    if (node.isLeaf) {
      return node;
    } else {
      let [_, pointerIndex] = binarySearch(node.keys, key);
      if (pointerIndex !== null) {
        return this.findLeafNode(key, node.pointers[pointerIndex]);
      }
    }
  }
  
  listKeys() {
    let ln = this.findLeafNode(1, this.root);
    while (ln) {
      console.log(ln.keys);
      ln = ln.nextNode;
    } 
  }
}

const bpt = new BPTree(4);
ins = bpt.insert;
bpt.insert(2);
bpt.insert(4);
bpt.insert(6);
bpt.insert(8);
bpt.insert(10);
bpt.insert(12);
bpt.insert(14);
bpt.insert(16);
bpt.insert(18);
bpt.insert(20);
bpt.insert(22);
bpt.insert(24);
bpt.insert(26);
bpt.insert(28);
bpt.insert(30);
bpt.insert(32);
bpt.insert(34);
bpt.insert(36);
bpt.insert(38);
bpt.insert(40);
bpt.insert(42);
bpt.insert(44);
bpt.insert(46);
bpt.insert(48);
bpt.insert(50);
bpt.insert(5);
bpt.insert(37);
console.log('ROOT', bpt.root);
console.log('keys', bpt.listKeys());

a = bpt.root.pointers.map(p => p.keys)
console.log(a);