var expect = require('chai').expect;
var support = require('./support');

var combine = require('../src/combine');

var supports = {
  a: support('combine/a'),
  b: support('combine/b')
};


describe('combine', function () {
  describe('group-a', function () {
    it('add', function () {
      expect(combine(supports.a('1-0'), supports.a(0))).be.deep.equal(supports.a(1));
    });
    it('reduce and change', function () {
      expect(combine(supports.a('2-1'), supports.a(1))).be.deep.equal(supports.a(2));
    });
    it('add, reduce and change', function () {
      expect(combine(supports.a('2-0'), supports.a(0))).be.deep.equal(supports.a(2));
    });
  });
  describe('group-b', function () {
    it('deep object', function () {
      console.log(supports.b('1-0'));
      expect(combine(supports.b('1-0'), supports.b(0))).be.deep.equal(supports.b(1));
    });
  });
});
