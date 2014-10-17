var _ = require('underscore');

module.exports = function (path, length) {
  return _.chain(_.range(length)).map(function (i) {
    return require('./' + path + '/' + i + '.json');
  }).value();
};
