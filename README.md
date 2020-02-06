# B+ Tree
My attempt at implementing a B+ tree in Node.js.
This data structure is very interesting because it is
self balancing, and unlike other tree data structures, it
grows from the bottom up rather than the top down. Data is only
stored in the leaf nodes and all internal nodes store keys and pointers
to the leaf nodes. The leaf nodes come to form a linked list.

The advantage of this data structure is that it grows very wide
and remains shallow which allows for less disk reads when serialized.
This makes it the ideal canidate for creating a database.