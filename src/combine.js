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

var combineRemoved = function (increment, older) {
  _.each(increment, function (val, key) {
    if (val === 0) {
      delete older[key];
    } else if (_.isObject(val)) {
      combineRemoved(val, older[key]);
    }
  });
};

var combineUpdated = function (increment, older) {
  _.each(increment, function (val, key) {
    if (!_.isObject(val)) {
      older[key] = val;
    } else {
      combineUpdated(val, older[key]);
    }
  });
};

var combine = function (increment, older) {
  var result = new Object(older);
  combineRemoved(increment['-'], result);
  combineUpdated(increment['+'], result);
  return result;
};


module.exports = combine;