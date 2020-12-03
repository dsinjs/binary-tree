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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BTree = void 0;
var btreenode_1 = require("./btreenode");
var UnreachableError = /** @class */ (function (_super) {
    __extends(UnreachableError, _super);
    function UnreachableError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = "UnreachableError";
        return _this;
    }
    return UnreachableError;
}(Error));
var FilteredRootError = /** @class */ (function (_super) {
    __extends(FilteredRootError, _super);
    function FilteredRootError(msg) {
        var _this = _super.call(this, msg) || this;
        _this.name = "FilteredRootError";
        return _this;
    }
    return FilteredRootError;
}(Error));
// if Symbol is not available in window
if (typeof window !== "undefined") {
    if (typeof Symbol === "undefined") {
        var win = window;
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
var BTree = /** @class */ (function () {
    /**
     * Constructor for Binary Tree.
     * @param {BTreeRootAttrStruct|BTreeValueAttrStruct|T} attr Can be of type object, string, number.
     * In case of object root/value property is expected to be value of root node.
     * @constructor
     */
    function BTree(attr) {
        /**
         * Depth of the binary tree.
         * @type {number}
         * @property depth
         */
        this.depth = 1;
        if (typeof attr == "object" && typeof attr.root !== "undefined") {
            this.root = new btreenode_1.BTreeNode({ value: attr.root });
        }
        else if (typeof attr == "object" && typeof attr.value !== "undefined") {
            this.root = new btreenode_1.BTreeNode({ value: attr.value });
        }
        else {
            this.root = new btreenode_1.BTreeNode({ value: attr });
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
    BTree.prototype.toString = function () {
        return this.root.toString();
    };
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
    BTree.prototype.toJSON = function () {
        return this.root.toJSON();
    };
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
    BTree.prototype.toArray = function () {
        var arr = [];
        this.each(function (node, index) {
            arr.push(node);
        });
        return arr;
    };
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
    BTree.prototype.toFlatArray = function () {
        var arr = [];
        this.each(function (node, index) {
            arr.push(node.value);
        });
        return arr;
    };
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
    BTree.prototype.insert = function (val) {
        return this.insertLeftMost(val);
    };
    /**
     * Inserts the given value to the tree where first free left child node is found.
     * @param {T} val any type of value to be added to tree node.
     * @method insertLeftMost
     * @member
     * @returns {BTreeNode<T>} Returns newly created BTreeNode.
     */
    BTree.prototype.insertLeftMost = function (val) {
        var node = this.root;
        while (node.lNode != null) {
            node = node.lNode;
        }
        node.lNode = new btreenode_1.BTreeNode({ value: val });
        this.depth = this.root.getDepth();
        return node.lNode;
    };
    /**
     * Inserts the given value to the tree where first free right child node is found.
     * @param {T} val any type of value to be added to tree node.
     * @method insertRightMost
     * @member
     * @public
     * @returns {BTreeNode<T>} Returns newly created BTreeNode.
     */
    BTree.prototype.insertRightMost = function (val) {
        var node = this.root;
        while (node.rNode != null) {
            node = node.rNode;
        }
        node.rNode = new btreenode_1.BTreeNode({ value: val });
        this.depth = this.root.getDepth();
        return node.rNode;
    };
    /**
     * Deletes given value from tree.
     * Travarsal = Root -> L -> R.
     * @param {T} val Value to be removed.
     * @returns {BTreeNode<T>} Returns removed BTreeNode.
     * @method delete
     * @member
     * @public
     */
    BTree.prototype.delete = function (val) {
        /**
         * @private
         * @param {BTreeNode<T>} currNode Current node.
         * @returns {BTreeNode<T>} Returns removed BTreeNode.
         */
        var recDel = function (currNode) {
            if (currNode == null) {
                return currNode;
            }
            var cacheRetLeft = currNode.lNode;
            var cacheRetRight = currNode.rNode;
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
            var delL = recDel(currNode.lNode);
            var delR = (!delL) ? recDel(currNode.rNode) : null;
            return delL || delR;
        };
        var delItem = recDel(this.root);
        this.depth = this.root.getDepth();
        return delItem;
    };
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
    BTree.prototype.insertAt = function (val, index) {
        var e_1, _a;
        var path = BTree.getPathFromIndex(index);
        var currNode = this.root;
        try {
            for (var _b = __values(path.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), index_1 = _d[0], item = _d[1];
                if (item === 'L') {
                    if (currNode.lNode == null && path.length !== index_1 + 1) {
                        throw new UnreachableError('Given index cannot be reached');
                    }
                    else if (currNode.lNode == null) {
                        currNode.lNode = new btreenode_1.BTreeNode({ value: val });
                    }
                    else {
                        currNode = currNode.lNode;
                    }
                }
                if (item === 'R') {
                    if (currNode.rNode == null && path.length !== index_1 + 1) {
                        throw new UnreachableError('Given index cannot be reached');
                    }
                    else if (currNode.rNode == null) {
                        currNode.rNode = new btreenode_1.BTreeNode({ value: val });
                    }
                    else {
                        currNode = currNode.rNode;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.depth = this.root.getDepth();
    };
    /**
     * Breadth first search. Executes given callback functions with parameters BTreeNode and path index
     * for each node in BFS fashion.
     * @param {{(node: BTreeNode<T>, index: number) => any}} callback A callback function for execution of
     * each node.
     * @method traverseBFS
     * @member
     * @public
     * @returns {void} no value.
     */
    BTree.prototype.traverseBFS = function (callback) {
        var currCount = 0;
        var children = [];
        /**
         *
         * @param {BTreeNode<T>} currNode current node in recursion.
         * @private
         */
        var recInser = function (currNode, currPath) {
            if (currNode != null) {
                var currPathL = JSON.parse(JSON.stringify(currPath));
                currPathL.push('L');
                var currPathR = JSON.parse(JSON.stringify(currPath));
                currPathR.push('R');
                children.push({ node: currNode.lNode, path: currPathL });
                children.push({ node: currNode.rNode, path: currPathR });
                callback(currNode, BTree.getIndexFromPath(currPath));
            }
            currCount++;
            if (children.length) {
                var item = children.splice(0, 1)[0];
                return recInser(item.node, item.path);
            }
            else {
                return;
            }
        };
        recInser(this.root, ['U']);
    };
    /**
     * Depth first search, Executes given callback functions with parameters BTreeNode and path index for each node
     * in DFS fashion.
     * @param {{(node: BTreeNode<T>, index: number) => any}} callback A callback function for execution of each node.
     * @method traverseDFS
     * @member
     * @public
     * @returns {void} no value.
     */
    BTree.prototype.traverseDFS = function (callback) {
        /**
         *
         * @param {BTreeNode<T>} currNode Currently processing node.
         * @param {Array<'U'|'L'|'R'>} path current path
         * @private
         */
        var recFnc = function (currNode, path) {
            if (currNode !== null) {
                callback(currNode, BTree.getIndexFromPath(path));
                if (currNode.lNode !== null) {
                    var lPath = JSON.parse(JSON.stringify(path));
                    lPath.push('L');
                    recFnc(currNode.lNode, lPath);
                }
                if (currNode.rNode !== null) {
                    var rPath = JSON.parse(JSON.stringify(path));
                    rPath.push('R');
                    recFnc(currNode.rNode, rPath);
                }
            }
        };
        recFnc(this.root, ['U']);
    };
    /**
     * Breadth first search. Executes given callback functions with parameters BTreeNode
     * and path index for each node in BFS fashion.
     * @param {{(node: BTreeNode<T>, index: number) => any}} callback A callback function for execution of each node.
     * @method each
     * @member
     * @public
     * @returns {void} no value.
     */
    BTree.prototype.each = function (callback) {
        return this.traverseBFS(callback);
    };
    /**
     * Breadth first search. Executes given callback functions with parameters BTreeNode and
     * path index for each node in BFS fashion.
     * @param {{(node: BTreeNode<T>, index: number) => any}} callback A callback function for execution of each node.
     * @method forEach
     * @member
     * @public
     * @returns {void} no value.
     */
    BTree.prototype.forEach = function (callback) {
        return this.traverseBFS(callback);
    };
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
    BTree.prototype[Symbol.iterator] = function () {
        var curr = -1;
        var arr = this.toArray();
        return {
            /**
             * @returns { {value: BTreeNode<T>, done: boolean} }
             * @private
             */
            next: function () {
                curr++;
                return {
                    value: (arr[curr] === void 0) ? void 0 : arr[curr],
                    done: !!(curr === arr.length)
                };
            }
        };
    };
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
    BTree.prototype.entries = function () {
        return this.toArray().entries();
    };
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
    BTree.prototype.map = function (callback) {
        var newTree = new BTree(callback(this.root.value));
        this.each(function (node, index) {
            if (index !== 1) {
                var retVal = callback(node.value);
                newTree.insertAt(retVal, index);
            }
        });
        return newTree;
    };
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
    BTree.prototype.filter = function (filterFnc) {
        if (!filterFnc(this.root.value)) {
            throw new FilteredRootError("Root node cannot be filtered. If you want to filter out root node, you can use emptry BTree instance.");
        }
        var newTree = new BTree(this.root.value);
        this.each(function (node, index) {
            if (index !== 1) {
                var canBeInserted = filterFnc(node.value);
                if (canBeInserted) {
                    newTree.insertAt(node.value, index);
                }
            }
        });
        return newTree;
    };
    /**
     * Reduces each node values using reduceFunction and returns final value.
     * @param {(next: T2, value: T, index: number, tree: BTree<T>) => T2} reduceFunction callback function
     * for reducing each node value to a final value.
     * @param {T2} initialValue Optional, Accumulator/Initial value.
     * @method reduce<T2>
     * @member
     * @public
     * @returns {T2} Returns reduceed value
     * @example
     * var tree = BTree.fromArray([10, 20, 30, 40]);
     * var sum = tree.reduce((acc, node) => acc + node); // => 100
     */
    BTree.prototype.reduce = function (reduceFunction, initialValue) {
        var _this = this;
        if (initialValue === void 0) { initialValue = 0; }
        var next = initialValue;
        this.each(function (node, index) {
            next = reduceFunction(next, node.value, index, _this);
        });
        return next;
    };
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
    BTree.prototype.reverse = function () {
        var trav = function (currNode) {
            if (currNode === null) {
                return;
            }
            var temp = currNode.lNode;
            currNode.lNode = currNode.rNode;
            currNode.rNode = temp;
            trav(currNode.lNode);
            trav(currNode.rNode);
        };
        trav(this.root);
        return this;
    };
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
    BTree.prototype.indexOf = function (value) {
        var retIndex = -1;
        this.each(function (node, index) {
            if (node.value === value && retIndex === -1) {
                retIndex = index;
            }
        });
        return retIndex;
    };
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
    BTree.prototype.includes = function (value) {
        return this.indexOf(value) !== -1;
    };
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
    BTree.prototype.exists = function (value) {
        return this.indexOf(value) !== -1;
    };
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
    BTree.prototype.has = function (value) {
        return this.indexOf(value) !== -1;
    };
    /**
     * Sorts the tree based on compare function, Has option to sort only at children level.
     * @param {Function} compareFnc Function used to determine the order of the elements. It is expected to return
     * a negative value if first argument is less than second argument, zero if they're equal and a positive
     * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
     * ```ts
     * (a, b) => a - b)
     * ```
     * @param {boolean} atOnlyFirstChildLevel Optiona, Flag to specify if first child of each node should sorted.
     * Default is `false`.
     * @method sort
     * @member
     * @public
     * @returns {void} Returns undefined.
     * @example
     * var tree = BTree.fromArray([10, 200, 100, 50, 60, 90, 5, 3]);
     * tree.sort().toFlatArray(); // => [3,5,10,50,60,90,100,200]
     */
    BTree.prototype.sort = function (compareFnc, atOnlyFirstChildLevel) {
        if (compareFnc === void 0) { compareFnc = function (a, b) {
            if (a === void 0) { a = 0; }
            if (b === void 0) { b = 0; }
            return (a < b) ? -1 : (a == b) ? 0 : 1;
        }; }
        if (atOnlyFirstChildLevel === void 0) { atOnlyFirstChildLevel = false; }
        if (atOnlyFirstChildLevel) {
            var DFS_1 = function (node) {
                if (node !== null) {
                    var out = compareFnc(node.lNode, node.rNode);
                    if (out > 0) {
                        var temp = node.lNode;
                        node.lNode = node.rNode;
                        node.rNode = temp;
                    }
                    DFS_1(node.lNode);
                    DFS_1(node.rNode);
                }
            };
            DFS_1(this.root);
        }
        else {
            var arr_1 = [];
            var arrBFS_1 = [];
            var counter = 0;
            var children_1 = [];
            var BFS_1 = function (node) {
                if (node !== null && node.lNode !== null) {
                    children_1.push(node.lNode);
                }
                if (node !== null && node.rNode !== null) {
                    children_1.push(node.rNode);
                }
                if (node !== null) {
                    arrBFS_1.push(node);
                    arr_1.push(node.value);
                }
                if (children_1.length !== 0) {
                    var first = children_1[0];
                    children_1.splice(0, 1);
                    BFS_1(first);
                }
            };
            BFS_1(this.root);
            while (arr_1.length !== 0) {
                var min = arr_1[0];
                var minIndex = 0;
                for (var i = 1; i < arr_1.length; i++) {
                    var out = compareFnc(min, arr_1[i]);
                    if (out > 0) {
                        min = arr_1[i];
                        minIndex = i;
                    }
                }
                arrBFS_1[counter].value = min;
                arr_1.splice(minIndex, 1);
                counter++;
            }
        }
    };
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
    BTree.prototype.print = function () {
        var isit = false;
        this.traverseDFS(function (node, index) {
            var len = BTree.getPathFromIndex(index).length;
            var isFirst = (isit) ? " |-".repeat(len - 1) : "";
            console.log(isFirst, node.value, "(" + index + ")");
            isit = true;
        });
    };
    /**
     * Returns the first matched tree node. Traverses using BFS.
     * @param {T} item any value to find inside the tree.
     * @method find
     * @member
     * @public
     * @returns {BTreeNode<T> | null} Returns the first matched tree node, if not found, returns null.
     * @example
     */
    BTree.prototype.find = function (item) {
        var retNode = null;
        this.each(function (node, index) {
            if (node.value === item && retNode === null) {
                retNode = node;
            }
        });
        return retNode;
    };
    /**
     * Returns index value from given path.
     * @param {Array<'U'|'L'|'R'>} path Array for U L or R, which represents the quickest path to get to a node.
     * @returns {number} Returns index value.
     * @method getIndexFromPath
     * @public
     * @static
     * @member
     */
    BTree.getIndexFromPath = function (path) {
        path = JSON.parse(JSON.stringify(path));
        var score = 1;
        while (path.length != 0) {
            if (path[0] === 'U') {
                path.splice(0, 1);
            }
            else if (path[0] === 'L') {
                score = score * 2;
                path.splice(0, 1);
            }
            else if (path[0] === 'R') {
                score = score * 2 + 1;
                path.splice(0, 1);
            }
        }
        return score;
    };
    /**
     * Returns Path equivalent to the given index.
     * @param {number} index Index number from which path to be calculated.
     * @returns {Array<'U'|'L'|'R'>} Path equivalent to the given index.
     * @method getPathFromIndex
     * @public
     * @static
     */
    BTree.getPathFromIndex = function (index) {
        var path = [];
        while (index != 1) {
            if (index % 2 === 0) {
                path.push('L');
            }
            else {
                path.push('R');
                index = index - 1;
            }
            index = index / 2;
        }
        path.push('U');
        path = path.reverse();
        return path;
    };
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
    BTree.fromArray = function (arr) {
        var e_2, _a;
        var newArr = JSON.parse(JSON.stringify(arr));
        var tree = new BTree(newArr[0]);
        try {
            for (var _b = __values(arr.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), index = _d[0], item = _d[1];
                if (index !== 0) {
                    tree.insertAt(item, index + 1);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return tree;
    };
    return BTree;
}());
exports.BTree = BTree;
if (typeof module != "undefined") {
    module.exports = { BTree: BTree, BTreeNode: btreenode_1.BTreeNode };
}
if (typeof window != "undefined") {
    window.DSinJS = window.DSinJS || {};
    window.DSinJS.BTree = BTree;
}
