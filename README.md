# @dsinjs/binary-tree
Data structure in your javascript code, Binary Trees.

[![Build Status](https://travis-ci.com/dsinjs/binary-tree.svg?branch=main)](https://travis-ci.com/dsinjs/binary-tree)
![Node.js CI](https://github.com/dsinjs/binary-tree/workflows/Node.js%20CI/badge.svg?branch=main)

## Installation:
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
## Usage:
```
const { BTreeNode, BTree } = require('@dsinjs/binary-tree');
```
```
var node = new BTreeNode({ value: 10 });
var nodel = new BTreeNode({ value: 15, lNode: node });
```
```
var tree1 = new BTree({ value: 10 });
var tree2 = new BTree({ root: 10 });
var tree3 = new BTree(10);
```
## All Features:
- All Binary Tree data structure functionality.
- extra functions like toString(), toJSON(), validate() etc.

## Complete Documentation
Checkout [DOCUMENTATION.md](DOCUMENTATION.md) for complete documentation or View Documentation online at [https://dsinjs.github.io/binary-tree/](https://dsinjs.github.io/binary-tree/)


## Help us expand:
Let me know in issues/github page or on email which javascript functions to include in next release.
Check all the [Contributing authors](CONTRIBUTING.md) to this library.