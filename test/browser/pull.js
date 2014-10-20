define(['./setup'], function (setup) {
  setup(function (run) {
    require(['jsonrcs'], function (jsonrcs) {
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
      });
      run();
    });
  });
});
