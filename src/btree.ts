import { BTreeNode } from "./btreenode";

declare let module: any;

export declare class ExtendedWindow extends Window {
  DSinJS: {
    BTreeNode: typeof BTreeNode;
    BTree: typeof BTree;
  };
  BTreeNode: typeof BTreeNode;
  BTree: typeof BTree;
}

declare let window: ExtendedWindow;

export declare class BTreeNodeStruct<T> {
  value?: T | null;
  lNode?: BTreeNodeStruct<T> | null;
  rNode?: BTreeNodeStruct<T> | null;
}

declare class BTreeRootAttrStruct<T> {
  root?: T;
}

declare class BTreeValueAttrStruct<T> {
  value?: T;
}

class UnreachableError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "UnreachableError";
  }
}


class FilteredRootError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "FilteredRootError";
  }
}

// if Symbol is not available in window
if (typeof window !== "undefined") {
  if (typeof Symbol === "undefined") {
    let win: any = window;
    win.Symbol = {};
    win.Symbol.iterator = "==iterator==";
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
export class BTree<T = any> {
  /**
   * Root node of the binary tree.
   * @type {BTreeNode}
   * @property root
   */
  root: BTreeNode<T>;
  /**
   * Depth of the binary tree.
   * @type {number}
   * @property depth
   */
  depth: number = 1;
  /**
   * Constructor for Binary Tree.
   * @param {BTreeRootAttrStruct|BTreeValueAttrStruct|T} attr Can be of type object, string, number. In case of object root/value property is expected to be value of root node.
   * @constructor
   */
  constructor(attr: BTreeRootAttrStruct<T> | BTreeValueAttrStruct<T> | T) {
    if (typeof attr == "object" && typeof (attr as BTreeRootAttrStruct<T>).root !== "undefined") {
      this.root = new BTreeNode<T>({ value: (attr as BTreeRootAttrStruct<T>).root });
    } else if (typeof attr == "object" && typeof (attr as BTreeValueAttrStruct<T>).value !== "undefined") {
      this.root = new BTreeNode<T>({ value: (attr as BTreeValueAttrStruct<T>).value });
    } else {
      this.root = new BTreeNode<T>({ value: attr as T });
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
   * tree.toArray(); // => [{value:10,...},{value:20,...}]
   */
  toArray(): BTreeNode<T>[] {
    const arr: BTreeNode<T>[] = [];
    this.each((node: BTreeNode<T>, index: number) => {
      arr.push(node);
    });
    return arr;
  }

  /**
   * Returns array of values of the tree.
   * @method toFlatArray
   * @member
   * @public
   * @returns {Array<T>} Returns array form of given tree.
   * @example
   * var tree = new BTree(10);
   * tree.insert(20);
   * tree.toFlatArray(); // => [10,20]
   */
  toFlatArray(): T[] {
    const arr: T[] = [];
    this.each((node: BTreeNode<T>, index: number) => {
      arr.push(node.value as T);
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
  insert(val: T) {
    return this.insertLeftMost(val);
  }

  /**
   * Inserts the given value to the tree where first free left child node is found.
   * @param {T} val any type of value to be added to tree node.
   * @method insertLeftMost
   * @member
   * @returns {BTreeNode<T>} Returns newly created BTreeNode.
   */
  insertLeftMost(val: T): BTreeNode<T> {
    let node = this.root;
    while (node.lNode != null) {
      node = node.lNode;
    }
    node.lNode = new BTreeNode<T>({ value: val });
    this.depth = this.root.getDepth();
    return node.lNode;
  }

  /**
   * Inserts the given value to the tree where first free right child node is found.
   * @param {T} val any type of value to be added to tree node.
   * @method insertRightMost
   * @member
   * @public
   * @returns {BTreeNode<T>} Returns newly created BTreeNode.
   */
  insertRightMost(val: T) {
    let node = this.root;
    while (node.rNode != null) {
      node = node.rNode;
    }
    node.rNode = new BTreeNode<T>({ value: val });
    this.depth = this.root.getDepth();
    return node.rNode;
  }

  /**
   * Deletes given value from tree.
   * Travarsal = Root -> L -> R.
   * @param {T} val Value to be removed.
   * @returns {BTreeNode<T>} Returns removed BTreeNode.
   * @method delete
   * @member
   * @public
   */
  delete(val: T): BTreeNode<T> {
    /**
     * @private
     * @param {BTreeNode<T>} currNode Current node.
     * @returns {BTreeNode<T>} Returns removed BTreeNode.
     */
    const recDel = (currNode: BTreeNode<T>): BTreeNode<T> | null => {
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
      const delL = recDel(currNode.lNode as BTreeNode<T>);
      const delR = (!delL) ? recDel(currNode.rNode as BTreeNode<T>) : null;
      return delL || delR;
    };

    const delItem = recDel(this.root);
    this.depth = this.root.getDepth();
    return delItem as BTreeNode<T>;
  }

  /**
   * Inserts given element at given location. If location is already taken then it does not insert any value.
   * @param {T} val value to insert.
   * @param {number} index index at which to append new element to.
   * @method insertAt
   * @member
   * @public
   * @throws UnreachableError
   * @example
   * tree.insertAt(20,2);
   */
  insertAt(val: T, index: number) {
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
   * @param {{(node: BTreeNode<T>, index: number) => any}} callback A callback function for execution of each node.
   * @method traverseBFS
   * @member
   * @public
   * @returns {void} no value.
   */
  traverseBFS(callback: (node: BTreeNode<T>, index: number) => any): void {
    let currCount = 0;
    const children: { node: BTreeNode<T>, path: Array<'U' | 'L' | 'R'> }[] = [];

    /**
     * 
     * @param {BTreeNode<T>} currNode current node in recursion.
     * @private
     */
    const recInser = (currNode: BTreeNode<T>, currPath: Array<'U' | 'L' | 'R'>): void => {
      if (currNode != null) {
        let currPathL: Array<'U' | 'L' | 'R'> = JSON.parse(JSON.stringify(currPath));
        currPathL.push('L');
        let currPathR: Array<'U' | 'L' | 'R'> = JSON.parse(JSON.stringify(currPath));
        currPathR.push('R');
        children.push({ node: currNode.lNode as BTreeNode<T>, path: currPathL });
        children.push({ node: currNode.rNode as BTreeNode<T>, path: currPathR });
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
   * @param {{(node: BTreeNode<T>, index: number) => any}} callback A callback function for execution of each node.
   * @method traverseDFS
   * @member
   * @public
   * @returns {void} no value.
   */
  traverseDFS(callback: (node: BTreeNode<T>, index: number) => any): void {
    /**
     * 
     * @param {BTreeNode<T>} currNode Currently processing node.
     * @param {Array<'U'|'L'|'R'>} path current path
     * @private
     */
    const recFnc = (currNode: BTreeNode<T>, path: Array<'U' | 'L' | 'R'>) => {
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
   * Breadth first search. Executes given callback functions with parameters BTreeNode and path index for each node in BFS fashion.
   * @param {{(node: BTreeNode<T>, index: number) => any}} callback A callback function for execution of each node.
   * @method each
   * @member
   * @public
   * @returns {void} no value.
   */
  each(callback: (node: BTreeNode<T>, index: number) => any): void {
    return this.traverseBFS(callback);
  }

  /**
   * Breadth first search. Executes given callback functions with parameters BTreeNode and path index for each node in BFS fashion.
   * @param {{(node: BTreeNode<T>, index: number) => any}} callback A callback function for execution of each node.
   * @method forEach
   * @member
   * @public
   * @returns {void} no value.
   */
  forEach(callback: (node: BTreeNode<T>, index: number) => any): void {
    return this.traverseBFS(callback);
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
       * @returns { {value: BTreeNode<T>, done: boolean} }
       * @private
       */
      next(): { value: BTreeNode<T>; done: boolean; } {
        curr++;
        return {
          value: (arr[curr] === void 0) ? void 0 as any : arr[curr],
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
   * @returns {IterableIterator<[number, BTreeNode<T>]>} Iterable for iterations.
   * @example
   * var tree = new BTree(10);
   * for (const [index, node] of tree.entries()) {
   *  console.log(index, node.value); // 0, 10
   * }
   */
  entries(): IterableIterator<[number, BTreeNode<T>]> {
    return this.toArray().entries();
  }

  /**
   * Maps current tree values to a new tree with modifying the values using given callback function.
   * Uses BFS.
   * @param {{(value: T) => T}} callback callback function for value modifier.
   * @method map
   * @member
   * @public
   * @returns {BTree<T>} A new BTree
   * @example
   * var tree = BTree.fromArray([10, 20, 30, 40]);
   * var tree2 = tree.map(n => n * 2);
   * var arr2 = tree2.toArray(); // [{value:20,...},{value:40,...},{value:60,...},{value:80,...}]
   */
  map(callback: (value: T) => T): BTree<T> {
    const newTree = new BTree(callback(this.root.value as T));
    this.each((node, index) => {
      if (index !== 1) {
        const retVal = callback(node.value as T);
        newTree.insertAt(retVal, index);
      }
    });
    return newTree;
  }

  /**
   * Filters each item based on given filter function
   * @param {{(value: T) => boolean}} filterFnc callback function for filtering purpose.
   * @method filter
   * @member
   * @public
   * @throws FilteredRootError, Error when root node gets filtered out.
   * @returns {BTree<T>} New filtered instance of tree.
   * @example
   * var tree = BTree.fromArray([10, 20, 30, 40]);
   * var tree2 = tree.filter(n => !!(n % 4 === 0 || n === 10));
   * var arr2 = tree2.toArray(); // [{value:10,...},{value:20,...},{value:40,...}]
   */
  filter(filterFnc: (value: T) => boolean): BTree<T> {
    if (!filterFnc(this.root.value as T)) {
      throw new FilteredRootError("Root node cannot be filtered. If you want to filter out root node, you can use emptry BTree instance.");
    }
    const newTree = new BTree(this.root.value as T);
    this.each((node, index) => {
      if (index !== 1) {
        const canBeInserted = filterFnc(node.value as T);
        if (canBeInserted) {
          newTree.insertAt(node.value as T, index);
        }
      }
    });
    return newTree;
  }

  /**
   * Reduces each node values using reduceFunction and returns final value.
   * @param {(next: T2, value: T, index: number, tree: BTree<T>) => T2} reduceFunction callback function for reducing each node value to a final value.
   * @param {T2} initialValue Optional, Accumulator/Initial value.
   * @method reduce<T2>
   * @member
   * @public
   * @returns {T2} Returns reduceed value
   * @example
   * var tree = BTree.fromArray([10, 20, 30, 40]);
   * var sum = tree.reduce((acc, node) => acc + node); // => 100
   */
  reduce<T2 = any>(reduceFunction: (next: T2, value: T, index: number, tree: BTree<T>) => T2, initialValue: T2 = 0 as any): T2 {
    let next = initialValue;
    this.each((node: BTreeNode<T>, index) => {
      next = reduceFunction(next, node.value as T, index, this);
    });
    return next;
  }

  /**
   * Reverses the current Binary Tree, Left Node becomes Right node and vise versa.
   * Does not return new instance, returns current tree instance.
   * @method reverse
   * @member
   * @public
   * @returns {BTree<T>} Returns current tree instance.
   * @example
   * var tree = BTree.fromArray([10, 20, 30, 40, 50, 60, 70, 80]);
   * tree.reverse().toArray(); // => [10, 30, 20, 70, 60, 50, 40, 80]
   */
  reverse(): BTree<T> {
    const trav = (currNode: BTreeNode<T>) => {
      if (currNode === null) {
        return;
      }
      const temp = currNode.lNode;
      currNode.lNode = currNode.rNode;
      currNode.rNode = temp;
      trav(currNode.lNode as BTreeNode<T>);
      trav(currNode.rNode as BTreeNode<T>);
    };
    trav(this.root);
    return this;
  }

  /**
   * Returns first index of a value matched, if it is not present, it returns -1.
   * @param {T} value Any value to find.
   * @method indexOf
   * @member
   * @public
   * @returns {number} Returns index of given item.
   * @example
   * var tree = BTree.fromArray([10, 20, 30, 40, 50, 60, 70, 80]);
   * tree.indexOf(30); // => 3
   * tree.indexOf(51); // => -1
   */
  indexOf(value: T): number {
    let retIndex = -1;
    this.each((node, index) => {
      if (node.value === value && retIndex === -1) {
        retIndex = index;
      }
    });

    return retIndex;
  }

  /**
   * Checks if given item exists or not, returns boolean.
   * @param {T} value Any value to check if it exists or not.
   * @method includes
   * @member
   * @public
   * @returns {boolean} Returns true if it is present, otherwise false.
   * @example
   * var tree = BTree.fromArray([10, 20, 30, 40, 50, 60, 70, 80]);
   * tree.includes(30); // true
   * tree.includes(51); // false
   */
  includes(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * Checks if given item exists or not, returns boolean.
   * @param {T} value Any value to check if it exists or not.
   * @method exists
   * @member
   * @public
   * @returns {boolean} Returns true if it is present, otherwise false.
   * @example
   * var tree = BTree.fromArray([10, 20, 30, 40, 50, 60, 70, 80]);
   * tree.exists(30); // true
   * tree.exists(51); // false
   */
  exists(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * Checks if given item exists or not, returns boolean.
   * @param {T} value Any value to check if it exists or not.
   * @method has
   * @member
   * @public
   * @returns {boolean} Returns true if it is present, otherwise false.
   * @example
   * var tree = BTree.fromArray([10, 20, 30, 40, 50, 60, 70, 80]);
   * tree.has(30); // true
   * tree.has(51); // false
   */
  has(value: T): boolean {
    return this.indexOf(value) !== -1;
  }

  /**
   * Sorts the tree based on compare function, Has option to sort only at children level.
   * @param {Function} compareFnc Function used to determine the order of the elements. It is expected to return
   * a negative value if first argument is less than second argument, zero if they're equal and a positive
   * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
   * ```ts
   * (a, b) => a - b)
   * ```
   * @param {boolean} atOnlyFirstChildLevel Optiona, Flag to specify if first child of each node should sorted. Default is `false`.
   * @method sort
   * @member
   * @public
   * @returns {void} Returns undefined.
   * @example
   * var tree = BTree.fromArray([10, 200, 100, 50, 60, 90, 5, 3]);
   * tree.sort().toFlatArray(); // => [3,5,10,50,60,90,100,200]
   */
  sort(compareFnc: <T2>(a: T2, b: T2) => number = (a = 0 as any, b = 0 as any) => { return (a < b) ? -1 : (a == b) ? 0 : 1; }, atOnlyFirstChildLevel: boolean = false): void {
    if (atOnlyFirstChildLevel) {
      const DFS = (node: BTreeNode<T>) => {
        if (node !== null) {
          const out = compareFnc(node.lNode, node.rNode);
          if (out > 0) {
            const temp = node.lNode;
            node.lNode = node.rNode;
            node.rNode = temp;
          }
          DFS(node.lNode as BTreeNode<T>);
          DFS(node.rNode as BTreeNode<T>);
        }
      };
      DFS(this.root);
    } else {
      const arr: T[] = [];
      const arrBFS: BTreeNode<T>[] = [];
      let counter = 0;
      const children: BTreeNode<T>[] = [];
      const BFS = (node: BTreeNode<T>) => {

        if (node !== null && node.lNode !== null) {
          children.push(node.lNode);
        }
        if (node !== null && node.rNode !== null) {
          children.push(node.rNode);
        }
        if (node !== null) {
          arrBFS.push(node);
          arr.push(node.value as T);
        }

        if (children.length !== 0) {
          const first = children[0];
          children.splice(0, 1);
          BFS(first);
        }
      };
      BFS(this.root);

      while (arr.length !== 0) {
        let min = arr[0];
        let minIndex = 0;
        for (let i = 1; i < arr.length; i++) {
          const out = compareFnc(min, arr[i]);
          if (out > 0) {
            min = arr[i];
            minIndex = i;
          }
        }
        arrBFS[counter].value = min;
        arr.splice(minIndex, 1);
        counter++;
      }
    }
  }

  /**
   * Prints entire tree on the console, useful for logging and checking status.
   * @method print
   * @member
   * @public
   * @returns {void} Returns undefined.
   * @example
   * var tree = BTree.fromArray([1, 2, 3]);
   * tree.print();
   * 1 (1)
   * |- 2 (2)
   * |- 3 (3)
   */
  print(): void {
    let isit = false;
    this.traverseDFS((node, index) => {
      const len = BTree.getPathFromIndex(index).length;
      const isFirst = (isit) ? " |-".repeat(len - 1) : "";
      console.log(isFirst, node.value, "(" + index + ")");
      isit = true;
    });
  }

  /**
   * Returns the first matched tree node. Traverses using BFS.
   * @param {T} item any value to find inside the tree.
   * @method find
   * @member
   * @public
   * @returns {BTreeNode<T> | null} Returns the first matched tree node, if not found, returns null.
   * @example
   */
  find(item: T): BTreeNode<T> | null {
    let retNode: BTreeNode<T> | null = null;
    this.each((node, index) => {
      if (node.value === item && retNode === null) {
        retNode = node;
      }
    });
    return retNode;
  }

  /**
   * Returns index value from given path.
   * @param {Array<'U'|'L'|'R'>} path Array for U L or R, which represents the quickest path to get to a node.
   * @returns {number} Returns index value.
   * @method getIndexFromPath
   * @public
   * @static
   * @member
   */
  static getIndexFromPath(path: Array<'U' | 'L' | 'R'>): number {
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
  static getPathFromIndex(index: number): Array<'U' | 'L' | 'R'> {
    let path: Array<'U' | 'L' | 'R'> = [];
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
   * @param {T2[]} arr Any array of values.
   * @returns {BTree<T2>} Newly generated tree.
   * @method fromArray
   * @static
   * @public
   * @example
   * var tree = BTree.fromArray([10,20,30,40]);
   */
  static fromArray<T2>(arr: T2[]): BTree<T2> {
    const newArr = JSON.parse(JSON.stringify(arr));
    const tree = new BTree<T2>(newArr[0]);

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
