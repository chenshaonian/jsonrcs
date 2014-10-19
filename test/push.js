var expect = require('chai').expect;
var path = require('path');
var support = require('./support');
var fs = require('fs-extra');

var push = require('../src/push');

var supports = {
  a: support('push/a')
};


describe('push', function () {
  describe('group-a', function () {
    before(function () {
      fs.copySync(path.join(__dirname, './support/push/a/app.json'), path.join(__dirname, './support/push/a/tmp/app.json'));
    });
    after(function () {
      fs.removeSync(path.join(__dirname, './support/push/a/tmp'));
    });
    it('generate', function () {
      push(path.join(__dirname, './support/push/a/tmp/app.json'));
      // console.log(fs.readJsonSync(path.join(__dirname, './support/push/a/tmp/_jsonrcs/app-last.json')));
    });
  });
});
