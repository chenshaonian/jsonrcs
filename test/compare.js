var expect = require('chai').expect;
var support = require('./support');

var compare = require('../src/compare');

var supports = {
  a: support('compare/a', 3),
  b: support('compare/b', 2)
};


describe('compare', function () {
  describe('group-a', function () {
    it('add', function () {
      expect(compare(supports.a[1], supports.a[0])).be.deep.equal({
        "-": {},
        "+": {
          "pineapple": "菠萝"
        }
      });
    });
    it('reduce and change', function () {
      expect(compare(supports.a[2], supports.a[1])).be.deep.equal({
        "-": {
          "banana": 0
        },
        "+": {
          "orange": "橘子"
        }
      });
    });
    it('add, reduce and change', function () {
      expect(compare(supports.a[2], supports.a[0])).be.deep.equal({
        "-": {
          "banana": 0
        },
        "+": {
          "orange": "橘子",
          "pineapple": "菠萝"
        }
      });
    });
  });
  describe('group-b', function () {
    it('deep object', function () {
      expect(compare(supports.b[1], supports.b[0])).be.deep.equal({
        "-": {
          "users": {
            "1": {
              "extra": 0
            },
            "2": 0
          },
        },
        "+": {
          "users": {
            "0": {
              "name": "yoga"
            }
          },
          "app": {
            "name": "jsonrcs-example"
          }
        }
      });
    });
  });
});
