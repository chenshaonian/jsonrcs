var _ = require('./util')._;

var diff = function (newer, older) {
  var result = {
    '-': {},
    '+': {}
  };
  var findRemoved = function (newer, older) {
    var result = {};
    _.each(older, function (val, key) {
      var removed;
      if (_.isUndefined(newer[key])) {
        result[key] = 0;
      } else if (_.isObject(val)) {
        removed = findRemoved(newer[key], val);
        if (!_.isEmptyObject(removed)) {
          result[key] = removed;
        }
      }
    });
    return result;
  };

  var findUpdated = function (newer, older) {
    var result = {};
    _.each(newer, function (val, key) {
      var updated;
      if (val !== older[key]) {
        if (typeof val !== 'object') {
          result[key] = val;
        } else {
          updated = findUpdated(val, older[key] || {});
          if (!_.isEmptyObject(updated)) {
            result[key] = updated;
          }
        }
      }

    });
    return result;
  };

  result['-'] = findRemoved(newer, older);

  result['+'] = findUpdated(newer, older);

  return result;
};

module.exports = diff;
