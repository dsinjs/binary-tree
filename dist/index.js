"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BTreeNode = require('./btreenode');

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
   * @returns {string} Returns string value of given tree.
   * @method toString
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
     * Inserts the given value to the tree where first free left child node is found.
     * @param {any} val any type of value to be added to tree node.
     * @returns {BTreeNode} Returns newly created BTreeNode.
     * @method insert
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
     * @returns {BTreeNode} Returns newly created BTreeNode.
     * @method insertLeftMost
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
     * @returns {BTreeNode} Returns newly created BTreeNode.
     * @method insertRightMost
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
     * @param {Function} callback cb function for each execution.
     * @method findBFS
     * @public
     * @returns void 0
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
     * Returns index value from given path.
     * @param {Array<'U'|'L'|'R'>} path Array for U L or R, which represents the quickest path to get to a node.
     * @returns {number} Returns index value.
     * @method getIndexFromPath
     * @public
     * @static
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
     * @static
     * @public
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