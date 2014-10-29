var expect = require('chai').expect;
var support = require('./support');

var diff = require('../../src/common/diff');

var supports = {
  a: support('combine-and-diff/a'),
  b: support('combine-and-diff/b'),
  c: support('combine-and-diff/c')
};


describe('diff', function () {
  describe('group-a', function () {
    it('add', function () {
      expect(diff(supports.a(1), supports.a(0))).be.deep.equal(supports.a('1-0'));
    });
    it('reduce and change', function () {
      expect(diff(supports.a(2), supports.a(1))).be.deep.equal(supports.a('2-1'));
    });
    it('add, reduce and change', function () {
      expect(diff(supports.a(2), supports.a(0))).be.deep.equal(supports.a('2-0'));
    });
  });
  describe('group-b', function () {
    it('deep object', function () {
      expect(diff(supports.b(1), supports.b(0))).be.deep.equal(supports.b('1-0'));
    });
  });
  describe('group-c', function () {
    it('deep object', function () {
      expect(diff(supports.c(1), supports.c(0))).be.deep.equal(supports.c('1-0'));
    });
  });
});
