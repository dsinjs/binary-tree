const { BTree, BTreeNode } = require("./btree");

declare let module: any;

if (typeof module != "undefined") {
  module.exports = { BTree, BTreeNode };
}