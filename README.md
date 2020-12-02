# @dsinjs/binary-tree
> Data structure in your JavaScript code, Binary Trees.

[![Build Status](https://travis-ci.com/dsinjs/binary-tree.svg?branch=main)](https://travis-ci.com/dsinjs/binary-tree)
![Node.js CI](https://github.com/dsinjs/binary-tree/workflows/Node.js%20CI/badge.svg?branch=main)

## Overview
Binary Tree in Javascript
```
      tree
      ----
       j    <-- root
     /   \
    f      k  
  /   \     \
 a     h     z    <-- leaves
```
- Binary tree always has nodes with maximum children of 2.
- Index starts with 1 such that index of j is 1, f is 2, z is 7 and so on.
- Root is single node always on top of the tree, in this case its j.
- Leaves nodes are the nodes who does not have any children, in this case its a, h, z.
## Installation
Using npm
```
npm install @dsinjs/binary-tree --save
```
Or directly on your browser, simply download your file from the following:
- [dsinjs-binarytree.js](dist/dsinjs-binarytree.js) Development version
- [dsinjs-binarytree.min.js](dist/dsinjs-binarytree.min.js) Deployment version
```
<script type="application/javascript" src="dsinjs-binarytree.js"></script>
<script type="application/javascript" src="dsinjs-binarytree.min.js"></script>
```
## Usage
```
const { BTreeNode, BTree } = require('@dsinjs/binary-tree');
```
```
var node = new BTreeNode({ value: 10 });
var nodel = new BTreeNode({ value: 15, lNode: node });
```
```
var tree = new BTree(10);
tree.insert(20);
tree.insert(30);
tree.delete(30);
tree.toArray(); // [{value:10,...},{value:20,...}]
```
```
// Classic ES6 iterations
for (const node of tree) {
    console.log(node.value); // 10, 20
}
```
## All Features:
- All Binary Tree data structure functionality.
- 25+ Binary Tree functions.
- Main functions like insert(), delete(), each(), find(), sort() etc.
- Extended functions like entries(), Symbol.iterator, supports `for...of` loops.
- Conversion methods like fromArray(), toArray(), toString(), toJSON().

## Complete Documentation
Checkout [DOCUMENTATION.md](DOCUMENTATION.md) for complete documentation or View Documentation online at [https://dsinjs.github.io/binary-tree/](https://dsinjs.github.io/binary-tree/)
> Note: May need to use polyfills for Array.entries(), to make BTree work in older browsers like IE11.

## Help us expand
Let me know in issues/github page or on email which javascript functions to include in next release.
Check all the [Contributing authors](CONTRIBUTING.md) to this library.