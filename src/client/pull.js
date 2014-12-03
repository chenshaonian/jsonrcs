var superagent = require('visionmedia/superagent');
var combine = require('../common/combine');
var Store = require('./store');


var exports = {};

var DIFF_DIR = '_jsonrcs';
var REVISION_DIR = '_jsonrcs/revision';

var EMPTY_HEAD = {data: {}, tag: 0};

var store = new Store();

var splitPath = function (path) {
  var match = path.match(/^(.*\/)*(.+?)(\.[^\.]+)?$/);
  return {
    dirname: match[1] || '',
    basename: match[2] || '',
    extname: match[3] || ''
  };
};

var getRevisionFilePath = exports.getRevisionFilePath = function (filePath, tag) {
  var path = splitPath(filePath);
  if (arguments.length < 2) {
    return filePath;
  } else {
    return path.dirname + DIFF_DIR + '/' + path.basename + '-' + tag + path.extname;
  }
};

var request = function (path, tag, callback) {
  superagent.get(getRevisionFilePath(path, tag))
    .accept('json')
    .end(function (err, res) {
      if (err) {
        return callback(err);
      }
      callback(null, res.body);
    });
};

var update = function (increment, head) {
  var last = {};
  last.data = combine(increment, head.data);
  last.tag = increment.tag;
  return last;
};

var pull = exports.pull = function (path, head, callback) {
  if (arguments.length < 3) {
    callback = head;
    head = store.get(path) || EMPTY_HEAD;
  }
  request(path, head.tag, function (err, increment) {
    if (err) {
      return callback(err);
    }
    var last = update(increment, head);
    store.set(path, last);
    callback(null, last);
  });
};

module.exports = exports;
