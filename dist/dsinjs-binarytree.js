(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
 * @class
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
},{}],2:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('./btreenode'),
    BTreeNode = _require.BTreeNode;

/**
 * @typedef {{ root: any }} BTreeRootAttrStruct
 * @interface
 * @private
 */

var bTreeRootAttrStruct = {};

/**
 * @typedef {{ value: any }} BTreeValueAttrStruct
 * @interface
 * @private
 */

var bTreeValueAttrStruct = {};

var UnreachableError = function (_Error) {
  _inherits(UnreachableError, _Error);

  function UnreachableError(msg) {
    _classCallCheck(this, UnreachableError);

    var _this = _possibleConstructorReturn(this, (UnreachableError.__proto__ || Object.getPrototypeOf(UnreachableError)).call(this, msg));

    _this.name = "UnreachableError";
    return _this;
  }

  return UnreachableError;
}(Error);

/**
 * BTree main class
 * @class
 * @public
 * @example
 * new BTree(10);
 * new BTree({ root: 10 });
 * new BTree({ value: 10 });
 */


var BTree = function () {
  /**
   * Constructor for Binary Tree.
   * @param {BTreeRootAttrStruct|BTreeValueAttrStruct|string|number} attr Can be of type object, string, number. In case of object root/value property is expected to be value of root node.
   * @constructor
   */
  function BTree(attr) {
    _classCallCheck(this, BTree);

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

    if ((typeof attr === "undefined" ? "undefined" : _typeof(attr)) == "object" && attr.root != void 0) {
      this.root = new BTreeNode({ value: attr.root });
    } else if ((typeof attr === "undefined" ? "undefined" : _typeof(attr)) == "object" && attr.value != void 0) {
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


  _createClass(BTree, [{
    key: "toString",
    value: function toString() {
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

  }, {
    key: "toJSON",
    value: function toJSON() {
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

  }, {
    key: "toArray",
    value: function toArray() {
      var arr = [];
      this.each(function (node, index) {
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

  }, {
    key: "insert",
    value: function insert(val) {
      return this.insertLeftMost(val);
    }

    /**
     * Inserts the given value to the tree where first free left child node is found.
     * @param {any} val any type of value to be added to tree node.
     * @method insertLeftMost
     * @member
     * @returns {BTreeNode} Returns newly created BTreeNode.
     */

  }, {
    key: "insertLeftMost",
    value: function insertLeftMost(val) {
      var node = this.root;
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

  }, {
    key: "insertRightMost",
    value: function insertRightMost(val) {
      var node = this.root;
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

  }, {
    key: "delete",
    value: function _delete(val) {
      /**
       * @private
       * @param {BTreeNode} currNode Current node.
       * @returns {BTreeNode} Returns removed BTreeNode.
       */
      var recDel = function recDel(currNode) {
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
        var delR = !delL ? recDel(currNode.rNode) : null;
        return delL || delR;
      };

      var delItem = recDel(this.root);
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

  }, {
    key: "insertAt",
    value: function insertAt(val, index) {
      var path = BTree.getPathFromIndex(index);
      var currNode = this.root;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = path.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              _index = _step$value[0],
              item = _step$value[1];

          if (item === 'L') {
            if (currNode.lNode == null && path.length !== _index + 1) {
              throw new UnreachableError('Given index cannot be reached');
            } else if (currNode.lNode == null) {
              currNode.lNode = new BTreeNode({ value: val });
            } else {
              currNode = currNode.lNode;
            }
          }
          if (item === 'R') {
            if (currNode.rNode == null && path.length !== _index + 1) {
              throw new UnreachableError('Given index cannot be reached');
            } else if (currNode.rNode == null) {
              currNode.rNode = new BTreeNode({ value: val });
            } else {
              currNode = currNode.rNode;
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
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

  }, {
    key: "findBFS",
    value: function findBFS(callback) {
      var currCount = 0;
      var children = [];

      /**
       * 
       * @param {BTreeNode} currNode current node in recursion.
       */
      var recInser = function recInser(currNode, currPath) {
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

  }, {
    key: "find",
    value: function find(callback) {
      /**
       * 
       * @param {BTreeNode} currNode Currently processing node.
       * @param {Array<'U'|'L'|'R'>} path current path
       */
      var recFnc = function recFnc(currNode, path) {
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
    }

    /**
     * Depth first search, Executes given callback functions with parameters BTreeNode and path index for each node in DFS fashion.
     * @param {Function} callback A callback function for execution of each node.
     * @method each
     * @member
     * @public
     * @returns {undefined}
     */

  }, {
    key: "each",
    value: function each(callback) {
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

  }, {
    key: "forEach",
    value: function forEach(callback) {
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

  }, {
    key: Symbol.iterator,
    value: function value() {
      var curr = -1;
      var arr = this.toArray();
      return {
        /**
         * @returns { {value: BTreeNode, done: boolean} }
         */
        next: function next() {
          curr++;
          return {
            value: arr[curr] === void 0 ? void 0 : arr[curr],
            done: !!(curr === arr.length)
          };
        }
      };
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

  }, {
    key: "entries",
    value: function entries() {
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

  }, {
    key: "map",
    value: function map(callback) {
      var newTree = new BTree(callback(this.root.value));
      this.each(function (node, index) {
        if (index !== 1) {
          var retVal = callback(node.value);
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

  }], [{
    key: "getIndexFromPath",
    value: function getIndexFromPath(path) {
      path = JSON.parse(JSON.stringify(path));
      var score = 1;
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

  }, {
    key: "getPathFromIndex",
    value: function getPathFromIndex(index) {
      var path = [];
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

  }, {
    key: "fromArray",
    value: function fromArray(arr) {
      var newArr = JSON.parse(JSON.stringify(arr));
      var tree = new BTree(newArr[0]);

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = arr.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              index = _step2$value[0],
              item = _step2$value[1];

          if (index !== 0) {
            tree.insertAt(item, index + 1);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return tree;
    }
  }]);

  return BTree;
}();

if (typeof module != "undefined") {
  module.exports = { BTree: BTree, BTreeNode: BTreeNode };
}
if (typeof window != "undefined") {
  window.DSinJS = window.DSinJS || {};
  window.DSinJS.BTree = BTree;
}
},{"./btreenode":1}]},{},[2]);
