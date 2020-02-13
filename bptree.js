const binarySearch = require('./binarySearch');
const orderedInsert = require('./orderedInsert');

class Node {
  constructor(m) {
    this.isLeaf = true;
    this.keys = [];
    this.pointers = [];
    this.size = 0;
    this.m = m;
    this.nextNode = null;
    this.parent = null;
    this.data = [];
  }

  isFull() {
    return this.keys.length === this.m;
  }

  insert(key, value) {
    if (this.isFull()) {
      return this.split(key);
    } else {
      let index = orderedInsert(this.keys, key);
      this.insertData(value, index);
      return [null, null];
    }
  }

  insertData(data, insertIndex) {
    if (this.isLeaf) {
      const d = this.data;
      for(let i = d.length; i > insertIndex; --i) {
        d[i] = d[i - 1];
      }
      d[insertIndex] = data;
    }
  }

  hasParent() {
    return this.parent != undefined;
  }

  // Split takes a new key to be insert and divides
  // the key array in half. It returns an array containing
  // the new root key and right half of the split keys
  split(newKey) {
    let insertIndex = orderedInsert(this.keys, newKey);
    // middle value of array becomes new root key
    // leaf nodes retain root key value when splits.
    // internal nodes do not retain the root key value.
    let newRootKey = this.keys[Math.floor(this.keys.length/2)];
    if (this.isLeaf) {
      let splitKeys = this.keys.splice(this.keys.length / 2, this.keys.length - 1);
      return [newRootKey, splitKeys, insertIndex];
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

  insert(key, value) {
    if (!this.root) {
      this.root = new Node(this.m);
      this.root.insert(key, value);
    } else {
      let [n, idx] = this.findLeafNode(key, this.root);
      //console.log('leafnode', n)
      if (n.isFull()) {
        let newData = n.data.splice(n.data.length / 2, n.data.length - 1);
        let [newRootKey, splitKeys] = n.insert(key, value);
        let newNode = new Node(this.m);
        newNode.keys = splitKeys;
        newNode.parent = n.parent;
        newNode.data = newData
        newNode.insertData(value, newNode.keys.indexOf(key));
        newNode.nextNode = n.nextNode;
        n.nextNode = newNode;
        // If the leaf node has a parent, we must rebalance the parents pointers.
        // When we split a leaf node, the new node in memory will always be to the right
        // of the original node. Therefore we must insert a pointer to the new node
        // in between the original node and its neighbor. Idx is the index of the
        // original node, so we simply insert our new node into the next index
        if (n.parent) {
          n.parent.pointers.splice(idx+1, 0, newNode);
        }
        this.parentInsert(newRootKey, n, newNode);
      } else {
        n.insert(key, value);
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
        // if the immediate parent is not full, add the new key
        rightNode.parent = parent;
        parent.insert(key);
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

  findLeafNode(key, node, idx=-1) {
    if (node.isLeaf) {
      return [node, idx];
    } else {
      let [foundIndex, pointerIndex] = binarySearch(node.keys, key);
      if (pointerIndex !== null) {
        return this.findLeafNode(key, node.pointers[pointerIndex], pointerIndex);
      }
      if (foundIndex !== null) {
        return this.findLeafNode(key, node.pointers[foundIndex+1], foundIndex+1);
      }
    }
  }
  
  listKeys() {
    let [ln] = this.findLeafNode('a', this.root);
    let ll = [];
    while (ln) {
      ll.push(`${ln.keys} -> `);
      ln = ln.nextNode;
    }
    console.log(ll.join(','));
  }

  retrieve(key) {
    let [ln] = this.findLeafNode(key, this.root);
    let [i] = binarySearch(ln.keys, key);
    return ln.data[i];
  }
}

module.exports = BPTree;
