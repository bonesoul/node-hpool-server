MOCHA=node_modules/mocha/bin/mocha

test:
	node $(MOCHA) \

test-watch:
	node $(MOCHA) \
    --growl \
    --watch \
	--recursive

.PHONY: test test-watch