define(['./setup', './support/index'], function (setup, support) {

  var INIT_TIMESTAMP = 1413763200000;

  setup(function (run) {
    require(['jsonrcs', 'jsonrcs/common'], function (jsonrcs, common) {
      describe('browser', function () {
        describe('getRevisionPath', function () {
          var tag = 1413763200000;
          it('should get the correct path', function () {
            expect(jsonrcs.getRevisionFilePath('/path/to/file.ext', tag)).to.be.equal('/path/to/_jsonrcs/file-1413763200000.ext');
            expect(jsonrcs.getRevisionFilePath('/path/to/file.name.ext', tag)).to.be.equal('/path/to/_jsonrcs/file.name-1413763200000.ext');
            expect(jsonrcs.getRevisionFilePath('file.name.ext', tag)).to.be.equal('_jsonrcs/file.name-1413763200000.ext');
            expect(jsonrcs.getRevisionFilePath('./file.name.ext', tag)).to.be.equal('./_jsonrcs/file.name-1413763200000.ext');
            expect(jsonrcs.getRevisionFilePath('../file.name.ext', tag)).to.be.equal('../_jsonrcs/file.name-1413763200000.ext');
            expect(jsonrcs.getRevisionFilePath('../../file.name.ext', tag)).to.be.equal('../../_jsonrcs/file.name-1413763200000.ext');
            expect(jsonrcs.getRevisionFilePath('../../path/file.name.ext', tag)).to.be.equal('../../path/_jsonrcs/file.name-1413763200000.ext');
            expect(jsonrcs.getRevisionFilePath('http://domain.com/path/to/file.name.ext', tag)).to.be.equal('http://domain.com/path/to/_jsonrcs/file.name-1413763200000.ext');
          });
        });
        describe('pull', function () {
          before(function () {
            this.server = sinon.fakeServer.create();
            this.clock = sinon.useFakeTimers(INIT_TIMESTAMP);
          });
          it('should ok', function (done) {
            var subPath = '_jsonrcs/app-' + INIT_TIMESTAMP + '.json';
            var initObj = {
              "data": common._.deepClone(support('a/app-1.json')),
              "tag": INIT_TIMESTAMP
            };
            this.server.respondWith('GET', '/json/' + subPath, [200, {'Content-type': 'application/json'}, JSON.stringify(support('a/' + subPath))]);
            jsonrcs.pull('/json/app.json', initObj, function (obj) {
              expect(obj.data).to.be.not.deep.equal(support('a/app-1.json'));
              expect(obj.data).to.be.deep.equal(support('a/app-2.json'));
              done();
            });
            expect(this.server.requests[0].url).to.be.equal('/json/_jsonrcs/app-' + INIT_TIMESTAMP + '.json');
            this.server.respond();
          });
        });
      });
      run();
    });
  });
});
