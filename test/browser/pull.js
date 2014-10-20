define(['./setup'], function (setup) {
  setup(function (run) {
    require(['jsonrcs'], function (jsonrcs) {
      describe('browser', function () {
        describe('getRevisionPath', function () {
          var tag = 1413763200000;
          it('case 0', function () {
            expect(jsonrcs.getRevisionFilePath('/path/to/file.ext', tag)).to.be.equal('/path/to/_jsonrcs/file-1413763200000.ext');
          });
          it('case 1', function () {
            expect(jsonrcs.getRevisionFilePath('/path/to/file.name.ext', tag)).to.be.equal('/path/to/_jsonrcs/file.name-1413763200000.ext');
          });
          it('case 2', function () {
            expect(jsonrcs.getRevisionFilePath('file.name.ext', tag)).to.be.equal('_jsonrcs/file.name-1413763200000.ext');
          });
          it('case 3', function () {
            expect(jsonrcs.getRevisionFilePath('./file.name.ext', tag)).to.be.equal('./_jsonrcs/file.name-1413763200000.ext');
          });
          it('case 4', function () {
            expect(jsonrcs.getRevisionFilePath('../file.name.ext', tag)).to.be.equal('../_jsonrcs/file.name-1413763200000.ext');
          });
          it('case 5', function () {
            expect(jsonrcs.getRevisionFilePath('../../file.name.ext', tag)).to.be.equal('../../_jsonrcs/file.name-1413763200000.ext');
          });
          it('case 6', function () {
            expect(jsonrcs.getRevisionFilePath('../../path/file.name.ext', tag)).to.be.equal('../../path/_jsonrcs/file.name-1413763200000.ext');
          });
          it('case 7', function () {
            expect(jsonrcs.getRevisionFilePath('http://domain.com/path/to/file.name.ext', tag)).to.be.equal('http://domain.com/path/to/_jsonrcs/file.name-1413763200000.ext');
          });
        });
      });
      run();
    });
  });
});
