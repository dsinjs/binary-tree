import { BTreeNode } from "./btreenode";
import { BTree } from "./btree";

declare let module: any;

if (typeof module != "undefined") {
  module.exports = { BTree, BTreeNode };
}