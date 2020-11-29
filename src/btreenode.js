/**
 * @typedef {{value:T,lNode: BTreeNodeStruct | BTreeNode, rNode: BTreeNodeStruct | BTreeNode}} BTreeNodeStruct
 * @interface
 * @private
 */

const bTreeNodeStruct = {};

/**
 * Binary Tree node class, contains 2 child nodes and single value.
 * @class
 * @public
 * @example
 * var node = new BTreeNode({ value: 15 });
 * var node3 = new BTreeNode({ value: 30 });
 * var node2 = new BTreeNode({ value: 20, rNode: node, lNode: node3 });
 * console.log(node2.lNode.value); // 30
 */
class BTreeNode {
  /**
   * 
   * @param {BTreeNodeStruct} attr attributes to initialize the node.
   */
  constructor(attr = {}) {
    /**
     * @property value
     * Contains actual value
     * @type {any}
     * @public
     */
    this.value = attr.value || null;

    /**
     * @property lNode
     * Contains left child node
     * @type {BTreeNode}
     * @public
     */
    this.lNode = attr.lNode || null;

    if (!this.lNode instanceof BTreeNode) {
      this.lNode = new BTreeNode(this.lNode);
    }

    /**
     * @property rNode
     * Contains right child node
     * @type {BTreeNode}
     * @public
     */
    this.rNode = attr.rNode || null;

    if (!this.rNode instanceof BTreeNode) {
      this.rNode = new BTreeNode(this.rNode);
    }

    if (!this.validate()) {
      throw new Error("A BTree node must have a valid value, cannot be null or undefined");
    }
  }

  /**
   * Validates a BTree node, it must have a valid value (no undefined nor null).
   * @public
   * @returns {boolean}
   * @example
   * new BTreeNode(); // throws error saying `A BTree node must have a valid value, cannot be null or undefined`
   * var node = new BTreeNode({ value: 10 });
   * console.log(node.validate()); // true
   */
  validate() {
    return (this.value != void 0 || this.value != null);
  }

  /**
   * Converts current node and all children nodes in json format.
   * @public
   * @returns {BTreeNodeStruct}
   * @example
   * var node = new BTreeNode({ value: 10 });
   * var lNode = new BTreeNode({ value: 15, lNode: lNode });
   * console.log(node.toJSON()); // {value:15,lNode: {value: 10,lNode:null,rNode:null},rNode:null}
   */
  toJSON() {
    return {
      value: (this.value && typeof this.value.toJSON === "function") ? this.value.toJSON() : this.value,
      lNode: (this.lNode === null) ? null : this.lNode.toJSON(),
      rNode: (this.rNode === null) ? null : this.rNode.toJSON()
    };
  }

  /**
   * Converts current node and all children nodes in json format and append them together.
   * Goes in direction of U -> L -> R
   * @public
   * @returns {string}
   * @example
   * var node = new BTreeNode({ value: 10 });
   * var lNode = new BTreeNode({ value: 15, lNode: node });
   * console.log(node.toString()); // "1015"
   */
  toString() {
    const leftStr = (this.lNode === null) ? "" : this.lNode.toString();
    const rightStr = (this.rNode === null) ? "" : this.rNode.toString();
    const currStr = (typeof this.value.toString === "function") ? this.value.toString() : String(this.value);

    return this.value.toString() + leftStr + rightStr;
  }

  /**
   * Returns depth of its children.
   * Goes in direction of L -> R
   * @public
   * @returns {number}
   * @example
   * var node = new BTreeNode({ value: 10 });
   * var lNode = new BTreeNode({ value: 15, lNode: node });
   * var l2Node = new BTreeNode({ value: 15, lNode: lNode });
   * console.log(l2Node.getDepth()); // 3
   */
  getDepth() {
    const leftDepth = (this.lNode === null) ? 1 : this.lNode.getDepth() + 1;
    const rightDepth = (this.rNode === null) ? 1 : this.rNode.getDepth() + 1;

    return Math.max(leftDepth, rightDepth);
  }
}

if (typeof module != "undefined") {
  module.exports = { BTreeNode };
}
if (typeof window != "undefined") {
  window.DSinJS = window.DSinJS || {};
  window.DSinJS.BTreeNode = BTreeNode;
}
