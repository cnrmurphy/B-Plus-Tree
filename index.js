const BPTree = require('./bptree');

class Bucket {
  data = new BPTree(4);
  constructor(name) {
    this.name = name;
  }

  insert(k, v) {
    this.data.insert(k, v);
  }

  find(k) {
    return this.data.retrieve(k);
  }

  keys() {
    this.data.listKeys();
  }
}

const Item = (n,v) => ({
  name: n,
  value: 0
});

const b = new Bucket('items');
const names = [
  'alpha', 'beta', 'gamma', 'omega', 'sigma', 'zeta', 'phi',
  'zues', 'thore', 'odin', 'delta', 'dorian', 'taleb', 'tron',
  'tree', 'zelda', 'zora', 'zink', 'omincron', 'orion', 'zzz',
  'zio', 'zion', 'zpp', 'zss'
].map((n, i) => Item(n,(i+1)*10));

names.forEach(g => {
  b.insert(g.name, g);
});


b.keys();
console.log(b.find('zink'));
