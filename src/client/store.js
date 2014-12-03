var Emitter = require('component/emitter');

var PREFIX = '__JSONRCS__';

var ERRORS = {
  NOT_SUPPORTED: new Error('browser doesnot support localStorage'),
  PARSE: new Error('json parser error')
};

var Store = function () {
  if (!(this instanceof Store)) {
    return new Store();
  }
  Emitter.call(this);
  return this;
};

Emitter(Store.prototype);

Store.prototype.avaliable = !!window.localStorage;

Store.prototype._prefix = function (name) {
  return PREFIX + name;
};

Store.prototype.set = function (name, data) {
  if (!this.avaliable) {
    this.emit('error', ERRORS.NOT_SUPPORTED);
    return this;
  }
  window.localStorage.setItem(this._prefix(name), JSON.stringify(data));
  return this;
};

Store.prototype.get = function (name) {
  var val;
  if (!this.avaliable) {
    this.emit('error', ERRORS.NOT_SUPPORTED);
    return;
  }
  val = window.localStorage.getItem(this._prefix(name));
  if (null === val) {
    return;
  }
  try {
    return JSON.parse(val);
  } catch (e) {
    this.emit('error', ERRORS.PARSE);
    return;
  }
};

module.exports = Store;
