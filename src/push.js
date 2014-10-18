var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var diff = require('./diff');
var combine = require('./combine');
var _ = require('./common')._;

var DIFF_DIR = '_jsonrcs';
var RIVISION_DIR = '_jsonrcs/rivision';

var TIMESTAMP_LENGTH = 13;

var readJSON = function (filePath) {
  return JSON.parse(fs.readFileSync(filePath).toString());
};

var isHistoryOfFile = function (history, filePath) {
  var extFileName = path.extname(filePath);
  var baseFileName = path.basename(filePath, extFileName);
  var extHistoryName = path.extname(history);
  var baseHistoryName = path.basename(history, extHistoryName);

  return (baseHistoryName.slice(0, baseFileName.length) === baseFileName)
    && (baseHistoryName[baseFileName.length] === '-')
    && (!!(baseHistoryName.substr(baseFileName.length + 1, TIMESTAMP_LENGTH).match(/^\d+$/)))
    && (history.slice(baseFileName.length + 1 + TIMESTAMP_LENGTH) === extFileName);
};

var getNewTag = function () {
  return String(Date.now());
};

var getTagOfFile = function (fileName, originFileName) {
  var extNameLength = path.extname(originFileName).length;
  return fileName.slice(originFileName.length - extNameLength + 1, fileName.length - extNameLength);
};

var getFileName = function (filePath, tag) {
  var extName = path.extname(filePath);
  var baseName = path.basename(filePath, extName);
  tag = tag || getNewTag();
  return baseName  + '-' + tag + extName;
};

var getRevisionDir = function (filePath) {
  return path.join(path.dirname(filePath), RIVISION_DIR);
};

var getDiffDir = function (filePath) {
  return path.join(path.dirname(filePath), DIFF_DIR);
};

var save = function (filePath, obj) {
  return fs.writeFileSync(filePath, JSON.stringify(obj), 'utf-8');
};

var push = function (filePath) {
  var diffDir, revisionDir, revisionPath, revision, tag, newest, theHistory, theLastHistory;

  if (!fs.existsSync(filePath)) {
    throw new Error('file not found');
  }

  // generate new tag
  tag = getNewTag();

  // generate directory of diff and revision
  diffDir = getDiffDir(filePath);
  revisionDir = getRevisionDir(filePath);
  mkdirp.sync(revisionDir);

  // load new revision
  newest = readJSON(filePath);

  // load older revisions
  revisionPath = path.join(revisionDir, path.basename(filePath));
  if (!fs.existsSync(revisionPath)) {
    save(revisionPath, {});
  }
  revision = readJSON(revisionPath);

  // init cache of older revision
  theHistory = {};
  theLastHistory = {};

  _.each(revision, function (increment, tag) {
    // assign to the revision
    theHistory = combine(increment, theHistory);
    // save the diff file from the history to current
    save(path.join(diffDir, getFileName(filePath, tag)), diff(newest, theHistory));
    // cache the last file
    theLastHistory = theHistory;
  });

  // update the revision info file
  revision[tag] = diff(newest, theLastHistory);
  save(revisionPath, revision);

};

module.exports = push;

