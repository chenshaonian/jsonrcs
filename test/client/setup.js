define([], function () {
  return function (callback) {
    var run = function () {
      if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
      else { mocha.run(); }
    };
    require(['chai', 'mocha', 'sinon'], function (chai) {
      window.expect = chai.expect;
      mocha = window.mocha;
      mocha.ui('bdd');
      mocha.reporter('html');
      callback(run);
    });
  };
});
