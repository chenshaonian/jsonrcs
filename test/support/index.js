var _ = require('underscore');

module.exports = function (path) {
  return function (key) {
    return require('./' + path + '/' + key + '.json');;
  };
};
