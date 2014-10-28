var exports = {};

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

  _.deepClone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };
  
  return _;
})();

exports._ = _;

exports.isUnchange = function (increment) {
  return _.isEmptyObject(increment['-']) && _.isEmptyObject(increment['+']);
};

module.exports = exports;
