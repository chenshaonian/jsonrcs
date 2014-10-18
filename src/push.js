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

var push = function (filePath) {
  var diffDir, revisionDir, revisions, tag, newest;

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

  // load revisions of histories
  // histories = fs.readdirSync(revisionDir).filter(function (fileName) {
  //   console.log(fileName, filePath, isHistoryOfFile(fileName, filePath));
  //   return isHistoryOfFile(fileName, filePath);
  // }).map(function (fileName) {
  //   return path.join(revisionDir, fileName);
  // }).filter(function (filePath) {
  //   return fs.statSync(filePath).isFile();
  // }).map(function (filePath) {
  //   return {
  //     filename: path.basename(filePath),
  //     content: readJSON(filePath)
  //   };
  // });


  var theRevisionPath = path.join(revisionDir, path.basename(filePath));
  if (!fs.existsSync(theRevisionPath)) {
    save(theRevisionPath, {});
  }
  var theRevision = readJSON(theRevisionPath);

  var theHistory = {};
  var theLastHistory = {};

  console.log('--',theRevision);

  _.each(theRevision, function (increment, tag) {
    console.log('===', theHistory, increment);
    theHistory = combine(increment, theHistory);
    console.log(theHistory);
    save(path.join(diffDir, getFileName(filePath, tag)), increment);
    theLastHistory = theHistory;
  });

  theRevision[tag] = diff(newest, theLastHistory);

  save(theRevisionPath, theRevision);

  // _.each(histories, function (history) {
  //   var increment = diff(newest, history.content);
  //   save(path.join(diffDir, history.filename), increment);
  // });

  // save(path.join(revisionDir, getFileName(filePath, tag)), newest);

};

var save = function (filePath, obj) {
  return fs.writeFileSync(filePath, JSON.stringify(obj), 'utf-8');
};

module.exports = push;

