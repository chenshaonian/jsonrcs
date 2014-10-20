require(['superagent'], function (superagent) {

  var exports = {}

  var DIFF_DIR = '_jsonrcs';
  var REVISION_DIR = '_jsonrcs/revision';

  var splitPath = function (path) {
    var match = path.match(/^(.*\/)*(.+?)(\.[^\.]+)?$/);
    return {
      dirname: match[1] || '',
      basename: match[2] || '',
      extname: match[3] || ''
    };
  };

  var getRevisionFilePath = exports.getRivisionFilePath = function (filePath, tag) {
    var path = splitPath(filePath);
    return path.dirname + DIFF_DIR + '/' + path.basename + '-' + tag + path.extname;
  };

  // var pull = function (name, path, version) {
  //   var file = path + name + '-to-last-from-' + version + '.json';
  //   superagent.get(file).accept('json').end(function(res) {
  //     render({dict: res.body});
  //   });

  // };

  // superagent.get('/json/dict.json').accept('json').end(function(res) {
  //   render({dict: res.body});
  // });

  return exports;

});
