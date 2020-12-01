declare let module: any;

export class ExtendedWindow extends Window {
  DSinJS!: {
    BTreeNode: typeof BTreeNode;
  };
  BTreeNode!: typeof BTreeNode;
}

declare let window: ExtendedWindow;

export class BTreeNodeStruct<T> {
  value?: T | null;
  lNode?: BTreeNodeStruct<T> | null;
  rNode?: BTreeNodeStruct<T> | null;
}

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
export class BTreeNode<T = any> {
  /**
   * @property value
   * Contains actual value
   * @type {T}
   * @public
   */
  value: T | null;
  /**
   * @property lNode
   * Contains left child node
   * @type {BTreeNode}
   * @public
   */
  lNode: BTreeNode<T> | null;
  /**
   * @property rNode
   * Contains right child node
   * @type {BTreeNode}
   * @public
   */
  rNode: BTreeNode<T> | null;

  /**
   * 
   * @param {BTreeNodeStruct} attr attributes to initialize the node.
   */
  constructor(attr: BTreeNodeStruct<T>) {
    this.value = attr.value || null;

    this.lNode = null;

    if (!attr.lNode as any instanceof BTreeNode && attr.lNode !== void 0 && attr.lNode !== null) {
      this.lNode = new BTreeNode(attr.lNode);
    }

    this.rNode = null;

    if (!this.rNode as any instanceof BTreeNode && attr.rNode !== void 0 && attr.rNode !== null) {
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
  toJSON(): BTreeNodeStruct<T> {
    const anyVal: any = this.value;
    return {
      value: (this.value && typeof anyVal.toJSON === "function") ? anyVal.toJSON() : this.value,
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
    const anyVar: any = this.value;
    const leftStr: string = (this.lNode === null) ? "" : this.lNode.toString();
    const rightStr: string = (this.rNode === null) ? "" : this.rNode.toString();
    const currStr: string = (typeof anyVar.toString === "function") ? anyVar.toString() : String(this.value);

    return currStr + leftStr + rightStr;
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
    const leftDepth: number = (this.lNode === null) ? 1 : this.lNode.getDepth() + 1;
    const rightDepth: number = (this.rNode === null) ? 1 : this.rNode.getDepth() + 1;

    return Math.max(leftDepth, rightDepth);
  }
}

if (typeof module != "undefined") {
  module.exports = { BTreeNode };
}
if (typeof window != "undefined") {
  const modName: any = "DSinJS";
  window.DSinJS = window.DSinJS || {};
  window.DSinJS.BTreeNode = BTreeNode;
}
