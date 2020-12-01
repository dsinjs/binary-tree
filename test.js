const should = require('should');
const assert = require('assert');
const { BTreeNode, BTree } = require('./dist/index');

describe('@dsinjs/binary-tree', () => {
  describe('BTreeNode', () => {
    it('Constructor', (done) => {
      var tree = new BTreeNode({ value: 10 });
      tree.value.should.equal(10);
      done();
    });
    it('left child', (done) => {
      var tree = new BTreeNode({ value: 10 });
      var tree2 = new BTreeNode({ value: 15, lNode: tree });
      tree2.lNode.value.should.equal(10);
      done();
    });
    it('right child', (done) => {
      var tree = new BTreeNode({ value: 15 });
      var tree2 = new BTreeNode({ value: 20, rNode: tree });
      tree2.rNode.value.should.equal(15);
      done();
    });
    it('toJSON()', (done) => {
      var tree = new BTreeNode({ value: 15 });
      var tree2 = new BTreeNode({ value: 20, rNode: tree });
      tree2.toJSON().rNode.value.should.equal(15);
      done();
    });
    it('toString()', (done) => {
      var tree = new BTreeNode({ value: 15 });
      var tree3 = new BTreeNode({ value: 30 });
      var tree2 = new BTreeNode({ value: 20, rNode: tree, lNode: tree3 });
      tree2.toString().should.equal("203015");
      done();
    });
    it('validate()', (done) => {
      var tree1 = new BTreeNode({ value: 15 });
      tree1.validate().should.equal(true);
      should.throws(function () {
        var tree = new BTreeNode();
      });
      done();
    });
    it('getDepth()', (done) => {
      var node = new BTreeNode({ value: 10 });
      var lNode = new BTreeNode({ value: 15, lNode: node });
      var l2Node = new BTreeNode({ value: 15, lNode: lNode });
      l2Node.getDepth().should.equal(3);

      var node2 = new BTreeNode({ value: 10 });
      node2.getDepth().should.equal(1);
      done();
    });
  });
  describe('Binary Tree', () => {
    it('Constructor', (done) => {
      var tree1 = new BTree({ value: 10 });
      var tree2 = new BTree({ root: 10 });
      var tree3 = new BTree(10);

      tree1.root.value.should.equal(10);
      tree2.root.value.should.equal(10);
      tree3.root.value.should.equal(10);
      done();
    });

    describe('To Functions', () => {
      it('toString()', (done) => {
        var tree = new BTree(10);
        tree.insert(10);
        tree.insert(20);
        tree.insert(30);
        tree.toString().should.equal("10102030");
        done();
      });
      it('toJSON()', (done) => {
        var tree = new BTree(10);
        tree.insert(20);
        tree.toJSON();

        tree.toJSON().lNode.value.should.equal(20);
        done();
      });
      it('toArray()', (done) => {
        var tree = new BTree(10);
        tree.insert(20);

        tree.toArray()[0].value.should.equal(10);
        tree.toArray()[1].value.should.equal(20);
        done();
      });
    });

    describe('CRUD Functions', () => {
      it('insert()', (done) => {
        var tree = new BTree(10);
        tree.insert(10);
        tree.insert(20);
        tree.insert(30);
        tree.toString().should.equal("10102030");
        done();
      });
      it('insertLeftMost()', (done) => {
        var tree = new BTree(10);
        tree.insertLeftMost(10);
        tree.insertLeftMost(20);
        tree.insertLeftMost(30);
        tree.toString().should.equal("10102030");
        done();
      });
      it('insertRightMost()', (done) => {
        var tree = new BTree(10);
        tree.insertRightMost(10);
        tree.insertRightMost(20);
        tree.insertRightMost(30);
        tree.toString().should.equal("10102030");
        done();
      });
      it('insertAt()', (done) => {
        var tree = new BTree(10);
        tree.insertLeftMost(20);
        tree.insertRightMost(30);
        tree.insertAt(40, 4);
        tree.insertAt(50, 5);
        tree.insertAt(60, 6);
        tree.insertAt(70, 7);
        tree.toString().should.equal('10204050306070');
        done();
      });
      it('delete()', (done) => {
        var tree = new BTree(10);
        tree.insertRightMost(20);
        tree.insertRightMost(30);
        tree.insertLeftMost(20);
        tree.insertLeftMost(30);
        tree.delete(30);
        tree.depth.should.equal(3);
        done();
      });
      it('sort()', (done) => {
        var correctMatrix = { 1: 3, 2: 5, 3: 10, 4: 50, 5: 60, 6: 90, 7: 100, 8: 200 };
        var tree = BTree.fromArray([10, 200, 100, 50, 60, 90, 5, 3]);
        tree.sort();
        tree.each((node, index) => {
          node.value.should.equal(correctMatrix[index]);
        });

        var correctMatrix2 = { 1: 10, 2: 100, 3: 200, 4: 5, 5: 90, 6: 50, 7: 60, 13: 3 };
        var tree2 = BTree.fromArray([10, 200, 100, 50, 60, 90, 5, 3]);
        tree2.sort(void 0, true);
        tree2.each((node, index) => {
          node.value.should.equal(correctMatrix2[index]);
        });

        done();
      });
    });

    describe('Traversal Functions', () => {
      it('traverseBFS()', (done) => {
        var tree = new BTree(10);
        tree.insertRightMost(20);
        tree.insertRightMost(30);
        tree.insertLeftMost(40);
        tree.insertLeftMost(50);
        tree.insertLeftMost(60);
        tree.insertLeftMost(70);
        tree.insertRightMost(80);
        tree.insertLeftMost(90);
        tree.insertRightMost(100);

        // var correctMatrix = {1:10,2:40,20,};

        tree.traverseBFS((node, index) => { });
        done();
      });
      it('traverseDFS()', (done) => {
        var tree = new BTree(10);
        tree.insertLeftMost(20);
        tree.insertRightMost(30);
        tree.insertLeftMost(40);
        tree.insertRightMost(50);
        tree.insertLeftMost(60);
        tree.insertRightMost(70);
        tree.insertLeftMost(80);
        tree.insertRightMost(90);
        tree.insertLeftMost(100);
        tree.traverseDFS((node, index) => { });
        done();
      });

      it('print()', (done) => {
        var tree = BTree.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        tree.print();

        done();
      });

      it('find()', (done) => {
        var tree = BTree.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        var node = tree.find(11);
        node.value.should.equal(11);

        var tree2 = BTree.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        var node2 = tree2.find(19);
        node2.value.should.equal(19);
        
        var node3 = tree2.find(3);
        node3.lNode.value.should.equal(6);
        done();
      });
    });

    describe('Static Functions', () => {
      it('getIndexFromPath()', (done) => {
        BTree.getIndexFromPath(['U', 'L', 'L', 'R']).should.equal(9);
        BTree.getIndexFromPath(['U', 'R', 'L', 'R']).should.equal(13);
        BTree.getIndexFromPath(['U', 'L', 'R', 'R']).should.equal(11);
        done();
      });
      it('getPathFromIndex()', (done) => {
        var path1 = BTree.getPathFromIndex(9);
        path1[0].should.equal('U');
        path1[1].should.equal('L');
        path1[2].should.equal('L');
        path1[3].should.equal('R');

        var path2 = BTree.getPathFromIndex(13);
        path2[0].should.equal('U');
        path2[1].should.equal('R');
        path2[2].should.equal('L');
        path2[3].should.equal('R');

        var path2 = BTree.getPathFromIndex(11);
        path2[0].should.equal('U');
        path2[1].should.equal('L');
        path2[2].should.equal('R');
        path2[3].should.equal('R');
        done();
      });
    });

    describe('Static From Functions', () => {
      it('fromArray()', (done) => {
        BTree.fromArray([10, 20, 30, 40]).toString().should.equal('10204030');
        BTree.fromArray([10, 20, 30, 40, 50, 60, 70]).toString().should.equal('10204050306070');
        done();
      });
    });

    it('Iteration Functions', (done) => {
      var tree = BTree.fromArray([10]);
      for (const node of tree) {
        node.value.should.equal(10);
      }
      for (const [index, node] of tree.entries()) {
        node.value.should.equal(10);
        index.should.equal(0);
      }
      done();
    });

    describe('Extended Array functions', () => {
      it('map()', (done) => {
        var tree = BTree.fromArray([10, 20, 30, 40]);
        var tree2 = tree.map(n => n * 2);
        var arr2 = tree2.toArray();
        arr2.length.should.equal(4);
        arr2[0].value.should.equal(20);
        arr2[1].value.should.equal(40);
        arr2[2].value.should.equal(60);
        arr2[3].value.should.equal(80);
        done();
      });

      it('filter()', (done) => {
        var tree = BTree.fromArray([10, 20, 30, 40]);
        var tree2 = tree.filter(n => !!(n % 4 === 0 || n === 10));
        var arr2 = tree2.toArray();
        arr2.length.should.equal(3);
        arr2[0].value.should.equal(10);
        arr2[1].value.should.equal(20);
        arr2[2].value.should.equal(40);

        var tree3 = BTree.fromArray([2, 3, 4, 5]);
        var tree4 = tree3.filter(n => !!(n % 2 === 0));
        var arr4 = tree4.toArray();
        arr4.length.should.equal(2);
        arr4[0].value.should.equal(2);
        arr4[1].value.should.equal(4);
        done();
      });

      it('reduce()', (done) => {
        var tree = BTree.fromArray([10, 20, 30, 40]);
        var sum = tree.reduce((a, b) => a + b);
        sum.should.equal(100);

        var tree2 = BTree.fromArray([1, 2, 3, 4, 5]);
        var sum2 = tree2.reduce((a, b) => a * b, 1);
        sum2.should.equal(120);
        done();
      });

      it('reverse()', (done) => {
        var tree = BTree.fromArray([10, 20, 30, 40, 50, 60, 70, 80]);
        tree.reverse();
        var arr = tree.toArray();
        arr[0].value.should.equal(10);
        arr[1].value.should.equal(30);
        arr[2].value.should.equal(20);
        arr[3].value.should.equal(70);
        arr[4].value.should.equal(60);
        arr[5].value.should.equal(50);
        arr[6].value.should.equal(40);
        arr[7].value.should.equal(80);

        done();
      });

      it('indexOf()', (done) => {
        var tree = BTree.fromArray([10, 20, 30, 40]);
        tree.indexOf(10).should.equal(1);
        tree.indexOf(20).should.equal(2);
        tree.indexOf(30).should.equal(3);
        tree.indexOf(40).should.equal(4);
        tree.indexOf(50).should.equal(-1);

        done();
      });

      it('includes()', (done) => {
        var tree = BTree.fromArray([10, 20, 30, 40]);
        tree.includes(10).should.equal(true);
        tree.includes(20).should.equal(true);
        tree.includes(30).should.equal(true);
        tree.includes(40).should.equal(true);
        tree.includes(50).should.equal(false);

        done();
      });

      it('exists()', (done) => {
        var tree = BTree.fromArray([10, 20, 30, 40]);
        tree.exists(10).should.equal(true);
        tree.exists(20).should.equal(true);
        tree.exists(30).should.equal(true);
        tree.exists(40).should.equal(true);
        tree.exists(50).should.equal(false);

        done();
      });

      it('has()', (done) => {
        var tree = BTree.fromArray([10, 20, 30, 40]);
        tree.has(10).should.equal(true);
        tree.has(20).should.equal(true);
        tree.has(30).should.equal(true);
        tree.has(40).should.equal(true);
        tree.has(50).should.equal(false);

        done();
      });
    });

    it('Mix 1 new, insert, insert, delete, toArray', (done) => {
      var tree = new BTree(10);
      tree.insert(20);
      tree.insert(30);
      tree.delete(30);
      var tarray = tree.toArray();
      tarray.length.should.equal(2);
      tarray[1].value.should.equal(20);
      done();
    });

    it('Mix 2 fromArray toArray', (done) => {
      var tree = BTree.fromArray([10, 20, 30, 40]);
      var tarray = tree.toArray();
      tarray.length.should.equal(4);
      tarray[0].value.should.equal(10);
      tarray[1].value.should.equal(20);
      tarray[2].value.should.equal(30);
      tarray[3].value.should.equal(40);
      done();
    });
  });
});
