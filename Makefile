TESTS_SERVER = test/server/*.js
TESTS_BROWSER = test/browser/index.html
REPORTER = spec
TIMEOUT = 20000
MOCHA = ./node_modules/mocha/bin/mocha
MOCHA_PHANTOMJS = ./node_modules/mocha-phantomjs/bin/mocha-phantomjs

test-server:
	@NODE_ENV=test node $(MOCHA) -R $(REPORTER) -t $(TIMEOUT) $(TESTS_SERVER)

test-browser:
	@NODE_ENV=test node $(MOCHA_PHANTOMJS) -R $(REPORTER) -t $(TIMEOUT) $(TESTS_BROWSER)

test-all: test-server test-browser

.PHONY: test-all
