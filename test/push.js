var _ = require('underscore');
var expect = require('chai').expect;
var sinon = require('sinon');
var path = require('path');
var support = require('./support');
var fs = require('fs-extra');

var push = require('../src/push');

var supports = {
  a: support('push/a')
};

var INIT_TIMESTAMP = 1413763200000;


describe('push', function () {
  describe('group-a', function () {
    var clock;
    before(function () {
      clock = sinon.useFakeTimers(INIT_TIMESTAMP);
    });
    after(function () {
      clock.restore();
      fs.removeSync(path.join(__dirname, './support/push/a/tmp'));
    });
    it('generate', function () {
      var readRevisionFile = function (tag) {
        if (arguments.length === 0) {
          return fs.readJsonSync(path.join(__dirname, './support/push/a/tmp/_jsonrcs/revision/app.json'));
        } else {
          return fs.readJsonSync(path.join(__dirname, './support/push/a/tmp/_jsonrcs/app-'+ tag + '.json'));
        }
      };
      fs.copySync(path.join(__dirname, './support/push/a/app-1.json'), path.join(__dirname, './support/push/a/tmp/app.json'));
      push(path.join(__dirname, './support/push/a/tmp/app.json'));
      expect(readRevisionFile()).to.be.deep.equal([
          {
            "-": {},
            "+": {"app": {"name": "jsonrcs-alpha", "private": true}},
            "tag": "1413763200000"
          }
        ]);
      expect(readRevisionFile(INIT_TIMESTAMP))
        .to.be.deep.equal({"-": {}, "+": {}, "tag": "1413763200000"});

      clock.tick(1000);
      fs.copySync(path.join(__dirname, './support/push/a/app-2.json'), path.join(__dirname, './support/push/a/tmp/app.json'));
      _.each(_.range(2), function () {
        push(path.join(__dirname, './support/push/a/tmp/app.json'));
        expect(readRevisionFile()).to.be.deep.equal([
          {
            "-": {},
            "+": {"app":{"name":"jsonrcs-alpha","private":true}},
            "tag":"1413763200000"
          }, {
            "-": {"app":{"private":0}},
            "+": {"app":{"name":"jsonrcs","version":"1.0.0"}},
            "tag":"1413763201000"}
          ]);

        expect(readRevisionFile(INIT_TIMESTAMP))
          .to.be.deep.equal({
            "-": {"app": {"private": 0}},
            "+": {"app": {"name": "jsonrcs", "version": "1.0.0"}},
            "tag": "1413763200000"
          });
        expect(readRevisionFile(INIT_TIMESTAMP + 1000))
          .to.be.deep.equal({"-": {}, "+": {}, "tag": "1413763201000"});
      });
    });
  });
});
