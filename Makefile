APP_ROOT = `pwd`

console:
	NODE_ENV=dev APP_ROOT=${APP_ROOT} node

versions:
	node config/util/packageVersions.js

test:
	NODE_ENV=test APP_ROOT=${APP_ROOT}  find specs -type f -a -name *.spec.js -exec ./node_modules/mocha/bin/mocha --globals requirejsVars -R list --require should {} \;

lint:
	find . -type f -a ! -path './mytests/*' -a ! -path './.git/*' -a ! -path './web/*' -a ! -path './node_modules/*' -a ! -path './web-build/*' -exec ./node_modules/jshint/bin/hint {} --config config/build/jshint.config.json \;
	find web -type f -a ! -path 'web/css/*' -a ! -path 'web/images/*' -a ! -path 'web/js/lib/*' -a ! -path 'web/js/templates/*' -a ! -path 'web/layout.html' -exec ./node_modules/jshint/bin/hint {} --config config/build/jshint.config.web.json \;

build:
	node_modules/requirejs/bin/r.js -o config/build/web.build.json

clean:
	rm -Rf web-build

run-app-dev:
	NODE_ENV=dev APP_ROOT=${APP_ROOT} node config/build/mongoIndexes.js
	NODE_ENV=dev APP_ROOT=${APP_ROOT} node app/server.js

run-benchmarker-dev:
	NODE_ENV=dev APP_ROOT=${APP_ROOT} node benchmarker/server.js

run-app-prod:
	NODE_ENV=prod APP_ROOT=${APP_ROOT} node config/build/mongoIndexes.js
	NODE_ENV=prod APP_ROOT=${APP_ROOT} node app/server.js

run-cron-prod:
	NODE_ENV=prod APP_ROOT=${APP_ROOT} node app/cron.js
