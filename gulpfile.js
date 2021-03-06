var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

var Duo = require('duo');
var through = require('through2');
var _ = require('lodash');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var root = __dirname;
var paths = {
  src: path.join(root, './src'),
  test: path.join(root, './test')
};

function gulpDuo (opts) {

  var options = _.defaults(opts || {}, {
    standalone: ''
  });

  function compile (path, callback) {
    Duo(root).entry(path).standalone(options.standalone).run(function (err, bundle) {
      callback(null, bundle);
    });
  }

  function duo (file, encoding, callback) {
    if (file.isNull()) {
      callback(null, file);
    }
    compile(file.path, function (err, bundle) {
      if (err) {
        callback(err);
      }
      if (file.isBuffer()) {
        file.contents = new Buffer(bundle);
      }
      if (file.isStream()) {
        file.contents.write(bundle);
      }
      callback(null, file);
    });
  }

  return through.obj(duo);
}


gulp.task('client.js', function () {
  gulp.src('src/client/pull.js')
    .pipe(gulpDuo({standalone: 'jsonrcs'}))
    .pipe(rename({basename: 'client'}))
    .pipe(gulp.dest('./dest'));
});

gulp.task('test:client', function () {
  gulp.src(['test/client/index.html'])
    .pipe(mochaPhantomJS({
      reporter: 'list'
    }))
    .on('error', gutil.noop);
});

gulp.task('test:server', function () {
  gulp.src(['test/server/*.js'])
    .pipe(mocha({
      reporter: 'list'
    }))
    .on('error', gutil.noop);
});

gulp.task('test', ['test:client', 'test:server']);

gulp.task('watch', function () {
  gulp.watch(['src/**/*.js', 'test/**/*.{js,html,json}'], ['client.js', 'test'], function (event) {
  });
});

