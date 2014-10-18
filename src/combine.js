var _ = require('./common')._;

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