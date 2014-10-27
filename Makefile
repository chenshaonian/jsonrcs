TESTS_SERVER = test/server/*.js
TESTS_BROWSER = test/browser/index.html
REPORTER = spec
TIMEOUT = 20000
MOCHA = ./node_modules/mocha/bin/mocha
MOCHA_PHANTOMJS = ./node_modules/mocha-phantomjs/bin/mocha-phantomjs
BUILD = build.js

test-server:
	@NODE_ENV=test node $(MOCHA) -R $(REPORTER) -t $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS_SERVER) 

test-browser:
	@NODE_ENV=test node $(MOCHA_PHANTOMJS) -R $(REPORTER) -t $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS_BROWSER)

test-all: test-server test-browser

clean:
	@-rm -rf components $(BUILD)
	@-rm client.js client.min.js
	@-rm -rf node_modules npm-debug.log

jsonrcs.js:
	@duo --standalone jsonrcs ./src/pull.js > ./jsonrcs.js

$(BUILD):
	@duo --standalone jsonrcs ./src/pull.js > ./$(BUILD)

.PHONY: test-all