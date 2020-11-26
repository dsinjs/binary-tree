const should = require('should');
const assert = require('assert');
const BTreeNode = require('./src/index');

describe('@dsinjs/binary-tree', () => {
  describe('Class', () => {
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
  });
});
