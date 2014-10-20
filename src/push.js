var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var diff = require('./diff');
var combine = require('./combine');
var _ = require('./common')._;

var DIFF_DIR = '_jsonrcs';
var REVISION_DIR = '_jsonrcs/revision';

var TIMESTAMP_LENGTH = 13;

var EMPTY_RESIVION = [];

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

var generateDiffFile = function (newer, older, tag) {
  var result = diff(newer, older);
  result['tag'] = tag;
  return result;
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
  return path.join(path.dirname(filePath), REVISION_DIR);
};

var getDiffDir = function (filePath) {
  return path.join(path.dirname(filePath), DIFF_DIR);
};

var save = function (filePath, obj) {
  return fs.writeFileSync(filePath, JSON.stringify(obj), 'utf-8');
};

var push = function (filePath) {
  var diffDir, revisionDir, revisionPath, revision, tag, newest, newestDiff, theHistory, theLastHistory;

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
    save(revisionPath, EMPTY_RESIVION);
  }
  revision = readJSON(revisionPath);

  // init cache of older revision
  theHistory = {};
  theLastHistory = {};

  _.each(revision, function (increment) {
    var tag = increment.tag;
    // assign to the revision
    theHistory = combine(increment, theHistory);
    // save the diff file from the history to current
    save(path.join(diffDir, getFileName(filePath, tag)), generateDiffFile(newest, theHistory, tag));
    // cache the last file
    theLastHistory = theHistory;
  });

  // update the revision
  newestDiff = generateDiffFile(newest, theLastHistory, tag);
  if (!_.isEmptyObject(newestDiff['-']) || !_.isEmptyObject(newestDiff['+'])) {
    // update the revision info file
    revision.push(newestDiff);
    save(revisionPath, revision);

    // create an empty diff file for last risivion
    save(path.join(diffDir, getFileName(filePath, tag)), generateDiffFile({}, {}, tag));
  }


};

module.exports = push;

