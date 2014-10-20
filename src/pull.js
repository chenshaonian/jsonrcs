define(['superagent', 'jsonrcs/combine'], function (superagent, combine) {

  var exports = {};

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

  var getRevisionFilePath = exports.getRevisionFilePath = function (filePath, tag) {
    var path = splitPath(filePath);
    return path.dirname + DIFF_DIR + '/' + path.basename + '-' + tag + path.extname;
  };

  var pull = exports.pull = function (filePath, head, callback) {
    var path = getRevisionFilePath(filePath, head.tag);
    superagent.get(path)
      .accept('json')
      .end(function(err, res) {
        var increment = res.body;
        var result = {};
        result.data = combine(increment, head.data);
        result.tag = increment.tag;
        callback(result);
      });
  };


  return exports;

});
