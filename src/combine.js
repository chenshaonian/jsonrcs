!(function (name, deps, definition) {
  // Check define
  var hasDefine = typeof define === 'function',
    // Check exports
    hasExports = typeof module !== 'undefined' && module.exports;

  if (hasDefine) {
    // AMD Module or CMD Module
    define(name, deps, definition);
  } else if (hasExports) {
    // Node.js Module
    module.exports = definition(require('./common'));
  } else {
    // Assign to common namespaces or simply the global object (window)
    this[name] = definition.apply(this, this[deps]);
  }
})('jsonrcs/combine', ['jsonrcs/common'], function (common) {

  var _ = common._;

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

  return combine;
});
