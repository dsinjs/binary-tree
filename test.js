const should = require('should');
const assert = require('assert');
const { BTreeNode, BTree } = require('./src/index');

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
    it('findBFS()', (done) => {
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
      tree.findBFS(() => { });
      done();
    });
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
    it('fromArray()', (done) => {
      BTree.fromArray([10, 20, 30, 40]).toString().should.equal('10204030');
      BTree.fromArray([10, 20, 30, 40, 50, 60, 70]).toString().should.equal('10204050306070');
      done();
    });
  });
});
