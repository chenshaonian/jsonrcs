define([
  ], function () {
    var store = {
      'a/app-1.json': {
        "app": {
          "name": "jsonrcs-alpha",
          "private": true
        }
      },
      'a/app-2.json': {
        "app": {
          "name": "jsonrcs",
          "version": "1.0.0"
        }
      },
      'a/_jsonrcs/app-1413763200000.json': {"-":{"app":{"private":0}},"+":{"app":{"name":"jsonrcs","version":"1.0.0"}},"tag":"1413763200000"},
      'a/_jsonrcs/app-1413763201000.json': {"-":{},"+":{},"tag":"1413763201000"}
    };

    return function (path) {
      return store[path];
    };
});