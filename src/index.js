const { BTreeNode } = require('./btreenode');

/**
 * @typedef {{ root: any }} BTreeRootAttrStruct
 * @interface
 * @private
 */

const bTreeRootAttrStruct = {};

/**
 * @typedef {{ value: any }} BTreeValueAttrStruct
 * @interface
 * @private
 */

const bTreeValueAttrStruct = {};

class UnreachableError extends Error {
  constructor(msg) {
    super(msg);
    this.name = "UnreachableError";
  }
}

/**
 * BTree main class
 * @class
 * @public
 * @example
 * new BTree(10);
 * new BTree({ root: 10 });
 * new BTree({ value: 10 });
 */
class BTree {
  /**
   * Constructor for Binary Tree.
   * @param {BTreeRootAttrStruct|BTreeValueAttrStruct|string|number} attr Can be of type object, string, number. In case of object root/value property is expected to be value of root node.
   * @constructor
   */
  constructor(attr) {
    /**
     * Root node of the binary tree.
     * @type {BTreeNode}
     * @property root
     */
    this.root = null;

    /**
     * Depth of the binary tree.
     * @type {number}
     * @property depth
     */
    this.depth = null;

    if (typeof attr == "object" && attr.root != void 0) {
      this.root = new BTreeNode({ value: attr.root });
    } else if (typeof attr == "object" && attr.value != void 0) {
      this.root = new BTreeNode({ value: attr.value });
    } else {
      this.root = new BTreeNode({ value: attr });
    }
    this.depth = this.root.getDepth();
  }

  /**
   * Returns string value of given tree.
   * @method toString
   * @member
   * @public
   * @example
   * var tree = new BTree(10);
   * tree.insert(10);
   * tree.insert(20);
   * tree.insert(30);
   * tree.toString(); // "10102030"
   */
  toString() {
    return this.root.toString();
  }

  /**
   * Returns JSON Form.
   * @method toJSON
   * @member
   * @public
   * @returns {BTreeNodeStruct} Returns json form of a given tree.
   * @example
   * var tree = new BTree(10);
   * tree.insert(20);
   * tree.toJSON(); // {value:10,lNode:{value:20,lNode:null,rNode:null},rNode:null}
   */
  toJSON() {
    return this.root.toJSON();
  }

  /**
   * Returns array value.
   * @method toArray
   * @member
   * @public
   * @returns {Array<BTreeNode>} Returns array form of given tree.
   * @example
   * var tree = new BTree(10);
   * tree.insert(20);
   * tree.toArray(); // [{value:10,...},{value:20,...}]
   */
  toArray() {
    const arr = [];
    this.each((node, index) => {
      arr.push(node);
    });
    return arr;
  }

  /**
   * Inserts the given value to the tree where first free left child node is found.
   * @param {any} val any type of value to be added to tree node.
   * @returns {BTreeNode} Returns newly created BTreeNode.
   * @method insert
   * @member
   * @example
   * var tree = new BTree(10);
   * tree.insert(10);
   * tree.insert(20);
   * tree.insert(30);
   * tree.toString(); // "10102030"
   */
  insert(val) {
    return this.insertLeftMost(val);
  }

  /**
   * Inserts the given value to the tree where first free left child node is found.
   * @param {any} val any type of value to be added to tree node.
   * @method insertLeftMost
   * @member
   * @returns {BTreeNode} Returns newly created BTreeNode.
   */
  insertLeftMost(val) {
    let node = this.root;
    while (node.lNode != null) {
      node = node.lNode;
    }
    node.lNode = new BTreeNode({ value: val });
    this.depth = this.root.getDepth();
    return node.lNode;
  }

  /**
   * Inserts the given value to the tree where first free right child node is found.
   * @param {any} val any type of value to be added to tree node.
   * @method insertRightMost
   * @member
   * @public
   * @returns {BTreeNode} Returns newly created BTreeNode.
   */
  insertRightMost(val) {
    let node = this.root;
    while (node.rNode != null) {
      node = node.rNode;
    }
    node.rNode = new BTreeNode({ value: val });
    this.depth = this.root.getDepth();
    return node.rNode;
  }

  /**
   * Deletes given value from tree.
   * Travarsal = Root -> L -> R.
   * @param {*} val Value to be removed.
   * @returns {BTreeNode} Returns removed BTreeNode.
   * @method delete
   * @member
   * @public
   */
  delete(val) {
    /**
     * @private
     * @param {BTreeNode} currNode Current node.
     * @returns {BTreeNode} Returns removed BTreeNode.
     */
    const recDel = (currNode) => {
      if (currNode == null) {
        return currNode;
      }
      let cacheRetLeft = currNode.lNode;
      let cacheRetRight = currNode.rNode;
      if (cacheRetLeft == null && cacheRetRight == null) {
        return null;
      }
      if (currNode.lNode && currNode.lNode.value === val) {
        currNode.lNode = null;
        return cacheRetLeft;
      }
      if (currNode.rNode && currNode.rNode.value === val) {
        currNode.rNode = null;
        return cacheRetRight;
      }
      const delL = recDel(currNode.lNode);
      const delR = (!delL) ? recDel(currNode.rNode) : null;
      return delL || delR;
    };

    const delItem = recDel(this.root);
    this.depth = this.root.getDepth();
    return delItem;
  }

  /**
   * Inserts given element at given location. If location is already taken then it does not insert any value.
   * @param {any} val value to insert.
   * @param {number} index index at which to append new element to.
   * @method insertAt
   * @member
   * @public
   * @throws UnreachableError
   * @example
   * tree.insertAt(20,2);
   */
  insertAt(val, index) {
    const path = BTree.getPathFromIndex(index);
    let currNode = this.root;

    for (const [index, item] of path.entries()) {
      if (item === 'L') {
        if (currNode.lNode == null && path.length !== index + 1) {
          throw new UnreachableError('Given index cannot be reached');
        } else if (currNode.lNode == null) {
          currNode.lNode = new BTreeNode({ value: val });
        } else {
          currNode = currNode.lNode;
        }
      }
      if (item === 'R') {
        if (currNode.rNode == null && path.length !== index + 1) {
          throw new UnreachableError('Given index cannot be reached');
        } else if (currNode.rNode == null) {
          currNode.rNode = new BTreeNode({ value: val });
        } else {
          currNode = currNode.rNode;
        }
      }
    }

    this.depth = this.root.getDepth();
  }

  /**
   * Breadth first search. Executes given callback functions with parameters BTreeNode and path index for each node in BFS fashion.
   * @param {Function} callback A callback function for execution of each node.
   * @method findBFS
   * @member
   * @public
   * @returns {undefined}
   */
  findBFS(callback) {
    let currCount = 0;
    const children = [];

    /**
     * 
     * @param {BTreeNode} currNode current node in recursion.
     */
    const recInser = (currNode, currPath) => {
      if (currNode != null) {
        let currPathL = JSON.parse(JSON.stringify(currPath));
        currPathL.push('L');
        let currPathR = JSON.parse(JSON.stringify(currPath));
        currPathR.push('R');
        children.push({ node: currNode.lNode, path: currPathL });
        children.push({ node: currNode.rNode, path: currPathR });
        callback(currNode, BTree.getIndexFromPath(currPath));
      }
      currCount++;
      if (children.length) {
        const item = children.splice(0, 1)[0];
        return recInser(item.node, item.path);
      } else {
        return;
      }
    };
    recInser(this.root, ['U']);

  }

  /**
   * Depth first search, Executes given callback functions with parameters BTreeNode and path index for each node in DFS fashion.
   * @param {Function} callback A callback function for execution of each node.
   * @method find
   * @member
   * @public
   * @returns {undefined}
   */
  find(callback) {
    /**
     * 
     * @param {BTreeNode} currNode Currently processing node.
     * @param {Array<'U'|'L'|'R'>} path current path
     */
    const recFnc = (currNode, path) => {
      if (currNode !== null) {
        callback(currNode, BTree.getIndexFromPath(path));
        if (currNode.lNode !== null) {
          let lPath = JSON.parse(JSON.stringify(path));
          lPath.push('L');
          recFnc(currNode.lNode, lPath);
        }
        if (currNode.rNode !== null) {
          let rPath = JSON.parse(JSON.stringify(path));
          rPath.push('R');
          recFnc(currNode.rNode, rPath);
        }
      }
    };

    recFnc(this.root, ['U']);
  }

  /**
   * Depth first search, Executes given callback functions with parameters BTreeNode and path index for each node in DFS fashion.
   * @param {Function} callback A callback function for execution of each node.
   * @method each
   * @member
   * @public
   * @returns {undefined}
   */
  each(callback) {
    return this.find(callback);
  }

  /**
   * Depth first search, Executes given callback functions with parameters BTreeNode and path index for each node in DFS fashion.
   * @param {Function} callback A callback function for execution of each node.
   * @method each
   * @member
   * @public
   * @returns {undefined}
   */
  forEach(callback) {
    return this.find(callback);
  }

  /**
   * Returns an iterable of key, value pairs for every entry in the tree.
   * @method [Symbol.iterator]
   * @member
   * @public
   * @example
   * var tree = new BTree(10);
   * for (const node of tree) {
   *  console.log(node.value); // 10
   * }
   */
  [Symbol.iterator]() {
    let curr = -1;
    const arr = this.toArray();
    return {
      /**
       * @returns { {value: BTreeNode, done: boolean} }
       */
      next() {
        curr++;
        return {
          value: (arr[curr] === void 0) ? void 0 : arr[curr],
          done: !!(curr === arr.length)
        };
      }
    }
  }

  /**
   * Returns an iterable of key, value pairs for every entry in the tree.
   * @method entries
   * @member
   * @public
   * @returns {IterableIterator<[number, BTreeNode]>} Iterable for iterations.
   * @example
   * var tree = new BTree(10);
   * for (const [index, node] of tree.entries()) {
   *  console.log(index, node.value); // 0, 10
   * }
   */
  entries() {
    return this.toArray().entries();
  }

  /**
   * Maps current tree values to a new tree with modifying the values using given callback function.
   * @param {Function} callback callback function for value modifier.
   * @method map
   * @member
   * @public
   * @returns {BTree} A new BTree
   * @example
   * var tree = BTree.fromArray([10, 20, 30, 40]);
   * var tree2 = tree.map(n => n * 2);
   * var arr2 = tree2.toArray(); // [{value:20,...},{value:40,...},{value:80,...},{value:60,...}]
   */
  map(callback) {
    const newTree = new BTree(callback(this.root.value));
    this.each((node, index) => {
      if (index !== 1) {
        const retVal = callback(node.value);
        newTree.insertAt(retVal, index);
      }
    });
    return newTree;
  }

  /* filter(callback) {

  }

  reduce() {

  } */

  /**
   * Returns index value from given path.
   * @param {Array<'U'|'L'|'R'>} path Array for U L or R, which represents the quickest path to get to a node.
   * @returns {number} Returns index value.
   * @method getIndexFromPath
   * @public
   * @static
   * @member
   */
  static getIndexFromPath(path) {
    path = JSON.parse(JSON.stringify(path));
    let score = 1;
    while (path.length != 0) {
      if (path[0] === 'U') {
        path.splice(0, 1);
      } else if (path[0] === 'L') {
        score = score * 2;
        path.splice(0, 1);
      } else if (path[0] === 'R') {
        score = score * 2 + 1;
        path.splice(0, 1);
      }
    }

    return score;
  }

  /**
   * Returns Path equivalent to the given index.
   * @param {number} index Index number from which path to be calculated.
   * @returns {Array<'U'|'L'|'R'>} Path equivalent to the given index.
   * @method getPathFromIndex
   * @public
   * @static
   */
  static getPathFromIndex(index) {
    let path = [];
    while (index != 1) {
      if (index % 2 === 0) {
        path.push('L');
      } else {
        path.push('R');
        index = index - 1;
      }
      index = index / 2;
    }

    path.push('U');
    path = path.reverse();

    return path;
  }

  /**
   * Converts given values into a Binary Tree.
   * @param {any} arr Any array of values.
   * @returns {BTree} Newly generated tree.
   * @method fromArray
   * @static
   * @public
   * @example
   * var tree = BTree.fromArray([10,20,30,40]);
   */
  static fromArray(arr) {
    const newArr = JSON.parse(JSON.stringify(arr));
    const tree = new BTree(newArr[0]);

    for (const [index, item] of arr.entries()) {
      if (index !== 0) {
        tree.insertAt(item, index + 1);
      }
    }

    return tree;
  }
}

if (typeof module != "undefined") {
  module.exports = { BTree, BTreeNode };
}
if (typeof window != "undefined") {
  window.DSinJS = window.DSinJS || {};
  window.DSinJS.BTree = BTree;
}
