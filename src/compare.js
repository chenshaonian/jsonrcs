var _ = (function () {
  var _ = {};
  _.isObject = function (obj) {
    return typeof obj === 'object';
  };

  _.isUndefined = function (obj) {
    return typeof obj === 'undefined';
  };

  _.isArray = function (obj) {
    return obj instanceof Array;
  };

  _.has = function (obj, key) {
    return obj !== null && hasOwnProperty.call(obj, key);
  };

  _.isEmptyObject = function (obj) {
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  _.each = function (obj, callback) {
    var i, len;
    if (_.isArray(obj)) {
      for (i =0, len = obj.length; i < len; i++) {
        callback(obj[i], i, obj);
      }
    } else {
      for (i in obj) {
        callback(obj[i], i, obj);
      }
    }
    return obj;
  };
  return _;
})();

var compare = function (newer, older) {
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
          updated = findUpdated(val, older[key]);
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

module.exports = compare;