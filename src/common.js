!(function (name, definition) {
  // Check define
  var hasDefine = typeof define === 'function',
    // Check exports
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module or CMD Module
    define(name, definition);
  } else if (hasExports) {
    // Node.js Module
    module.exports = definition();
  } else {
    // Assign to common namespaces or simply the global object (window)
    this[name] = definition();
  }
})('jsonrcs/common', function () {

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

  return exports;
});
