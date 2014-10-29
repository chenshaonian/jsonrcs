var util = require('./util');

var _ = util._;

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
      older[key] = older[key] || {};
      combineUpdated(val, older[key]);
    }
  });
};

var combine = function (increment, older) {
  var result = _.deepClone(older);
  combineRemoved(increment['-'], result);
  combineUpdated(increment['+'], result);
  return result;
};

module.exports = combine;
