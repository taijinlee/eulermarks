if (process.env.NODE_ENV === undefined) {
  throw new Error('NODE_ENV not set. Try \'prod\' or \'dev\'.');
}
if (process.env.APP_ROOT === undefined) {
  throw new Error('APP_ROOT not set. Try ~/eulermarks or /service/eulermarks');
}

var express = require('express');
var appConfig = require('config').app;
var logger = require(process.env.APP_ROOT + '/logger/logger.js')();
var app = express.createServer();

// overwriting default date token definition
express.logger.token('date', function() { return Date().replace(/GMT-\d{4} /, ''); });

app.configure(function() {
  app.use(express.bodyParser({ uploadDir: process.env.APP_ROOT + '/tmp' }));
  app.use(express.cookieParser());
  // use this as _method = POST / PUT / DELETE in forms to emulate them without going through backbone
  app.use(express.methodOverride());
  // app.use(require('connect-gzip').gzip());
});

// services
var datastore = 'mongo';
var store = require(process.env.APP_ROOT + '/store/store.js')(datastore, 'localhost', 27017);
var history = require(process.env.APP_ROOT + '/history/history.js')(store);

// globally applied middleware
var cookieJar = require(process.env.APP_ROOT + '/cookieJar/cookieJar.js')();
var authMiddleware = require(process.env.APP_ROOT + '/app/middleware/auth.js')(store, cookieJar);
var cookieJarMiddleware = require(process.env.APP_ROOT + '/app/middleware/cookieJar.js')(store, cookieJar);


// load config based on environment
// specific to development
app.configure('dev', function () {
  process.env.WEB_ROOT = '/web';

  app.use(express.logger(logger.serverLogFormatDev()));
  app.use(express['static'](process.env.APP_ROOT + process.env.WEB_ROOT));

  app.use(cookieJarMiddleware.init);
  app.use(authMiddleware.getTokenUserId);
  app.use(app.router);
});

// specific to production
app.configure('prod', function () {
  process.env.WEB_ROOT = '/web-build';

  app.use(express.logger(logger.serverLogFormat()));
  app.use(express['static'](process.env.APP_ROOT + process.env.WEB_ROOT, {
    maxAge: 31536000000 // one year
  }));

  app.use(cookieJarMiddleware.init);
  app.use(authMiddleware.getTokenUserId);
  app.use(app.router);
});

// load routes
require(process.env.APP_ROOT + '/app/routes.js')(app, store, history);

// start listening
app.listen(appConfig.port);
logger.log({ message: 'server start', port: app.address().port });

// if dev, run cron in background
if (process.env.NODE_ENV === 'dev') {
  require(process.env.APP_ROOT + '/app/cron.js');
}
