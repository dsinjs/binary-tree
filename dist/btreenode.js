"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BTreeNode = exports.BTreeNodeStruct = exports.ExtendedWindow = void 0;
var ExtendedWindow = /** @class */ (function (_super) {
    __extends(ExtendedWindow, _super);
    function ExtendedWindow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ExtendedWindow;
}(Window));
exports.ExtendedWindow = ExtendedWindow;
var BTreeNodeStruct = /** @class */ (function () {
    function BTreeNodeStruct() {
    }
    return BTreeNodeStruct;
}());
exports.BTreeNodeStruct = BTreeNodeStruct;
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
var BTreeNode = /** @class */ (function () {
    /**
     *
     * @param {BTreeNodeStruct} attr attributes to initialize the node.
     */
    function BTreeNode(attr) {
        this.value = attr.value || null;
        this.lNode = null;
        if (!attr.lNode instanceof BTreeNode && attr.lNode !== void 0 && attr.lNode !== null) {
            this.lNode = new BTreeNode(attr.lNode);
        }
        this.rNode = null;
        if (!this.rNode instanceof BTreeNode && attr.rNode !== void 0 && attr.rNode !== null) {
            this.rNode = new BTreeNode(attr.rNode);
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
    BTreeNode.prototype.validate = function () {
        return (this.value != void 0 || this.value != null);
    };
    /**
     * Converts current node and all children nodes in json format.
     * @public
     * @returns {BTreeNodeStruct}
     * @example
     * var node = new BTreeNode({ value: 10 });
     * var lNode = new BTreeNode({ value: 15, lNode: lNode });
     * console.log(node.toJSON()); // {value:15,lNode: {value: 10,lNode:null,rNode:null},rNode:null}
     */
    BTreeNode.prototype.toJSON = function () {
        var anyVal = this.value;
        return {
            value: (this.value && typeof anyVal.toJSON === "function") ? anyVal.toJSON() : this.value,
            lNode: (this.lNode === null) ? null : this.lNode.toJSON(),
            rNode: (this.rNode === null) ? null : this.rNode.toJSON()
        };
    };
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
    BTreeNode.prototype.toString = function () {
        var anyVar = this.value;
        var leftStr = (this.lNode === null) ? "" : this.lNode.toString();
        var rightStr = (this.rNode === null) ? "" : this.rNode.toString();
        var currStr = (typeof anyVar.toString === "function") ? anyVar.toString() : String(this.value);
        return currStr + leftStr + rightStr;
    };
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
    BTreeNode.prototype.getDepth = function () {
        var leftDepth = (this.lNode === null) ? 1 : this.lNode.getDepth() + 1;
        var rightDepth = (this.rNode === null) ? 1 : this.rNode.getDepth() + 1;
        return Math.max(leftDepth, rightDepth);
    };
    return BTreeNode;
}());
exports.BTreeNode = BTreeNode;
if (typeof module != "undefined") {
    module.exports = { BTreeNode: BTreeNode };
}
if (typeof window != "undefined") {
    var modName = "DSinJS";
    window.DSinJS = window.DSinJS || {};
    window.DSinJS.BTreeNode = BTreeNode;
}
