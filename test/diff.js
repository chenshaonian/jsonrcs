var expect = require('chai').expect;
var support = require('./support');

var diff = require('../src/diff');

var supports = {
  a: support('combine-and-diff/a'),
  b: support('combine-and-diff/b')
};


describe('diff', function () {
  describe('group-a', function () {
    it('d- add', function () {
      console.log(supports.a(1), supports.a(0));
      expect(diff(supports.a(1), supports.a(0))).be.deep.equal(supports.a('1-0'));
    });
    it('d- reduce and change', function () {
      expect(diff(supports.a(2), supports.a(1))).be.deep.equal(supports.a('2-1'));
    });
    it('d- add, reduce and change', function () {
      expect(diff(supports.a(2), supports.a(0))).be.deep.equal(supports.a('2-0'));
    });
  });
  describe('group-b', function () {
    it('d- deep object', function () {
      expect(diff(supports.b(1), supports.b(0))).be.deep.equal(supports.b('1-0'));
    });
  });
});
