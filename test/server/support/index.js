var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var read = function (file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file)).toString());
};

module.exports = function (path) {
  return function (key) {
    var file = './' + path + '/' + key + '.json';
    return read(file);
  };
};
