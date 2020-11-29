"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @typedef {{value:T,lNode: BTreeNodeStruct | BTreeNode, rNode: BTreeNodeStruct | BTreeNode}} BTreeNodeStruct
 * @interface
 * @private
 */

var bTreeNodeStruct = {};

/**
 * Binary Tree node class, contains 2 child nodes and single value.
 * @class BTreeNode
 * @public
 * @example
 * var node = new BTreeNode({ value: 15 });
 * var node3 = new BTreeNode({ value: 30 });
 * var node2 = new BTreeNode({ value: 20, rNode: node, lNode: node3 });
 * console.log(node2.lNode.value); // 30
 */

var BTreeNode = function () {
  /**
   * 
   * @param {BTreeNodeStruct} attr attributes to initialize the node.
   */
  function BTreeNode() {
    var attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BTreeNode);

    /**
     * @property value
     * Contains actual value
     * @type {T}
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


  _createClass(BTreeNode, [{
    key: "validate",
    value: function validate() {
      return this.value != void 0 || this.value != null;
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

  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        value: this.value && typeof this.value.toJSON === "function" ? this.value.toJSON() : this.value,
        lNode: this.lNode === null ? null : this.lNode.toJSON(),
        rNode: this.rNode === null ? null : this.rNode.toJSON()
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

  }, {
    key: "toString",
    value: function toString() {
      var leftStr = this.lNode === null ? "" : this.lNode.toString();
      var rightStr = this.rNode === null ? "" : this.rNode.toString();
      var currStr = typeof this.value.toString === "function" ? this.value.toString() : String(this.value);

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

  }, {
    key: "getDepth",
    value: function getDepth() {
      var leftDepth = this.lNode === null ? 1 : this.lNode.getDepth() + 1;
      var rightDepth = this.rNode === null ? 1 : this.rNode.getDepth() + 1;

      return Math.max(leftDepth, rightDepth);
    }
  }]);

  return BTreeNode;
}();

if (typeof module != "undefined") {
  module.exports = { BTreeNode: BTreeNode };
}
if (typeof window != "undefined") {
  window.DSinJS = window.DSinJS || {};
  window.DSinJS.BTreeNode = BTreeNode;
}