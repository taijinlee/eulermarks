if (process.env.NODE_ENV === undefined) {
  throw new Error('NODE_ENV not set. Try \'prod\' or \'dev\'.');
}
if (process.env.APP_ROOT === undefined) {
  throw new Error('APP_ROOT not set. Try ~/eulermarks or /service/eulermarks');
}

var express = require('express');
var appConfig = require('config').benchmarker;
var logger = require(process.env.APP_ROOT + '/logger/logger.js')();
var runner = require(process.env.APP_ROOT + '/benchmarker/runner.js')();
var app = express.createServer();

// overwriting default date token definition
express.logger.token('date', function() { return Date().replace(/GMT-\d{4} /, ''); });

app.configure(function() {
  app.use(express.bodyParser({ uploadDir: process.env.APP_ROOT + '/tmp' }));
  app.use(express.cookieParser());
});

// load routes
app.post('/bench', function(req, res, next) {
  var userId = req.body.userId;
  var repo = req.body.repo;
  var filename = req.body.filename;
  var sha = req.body.sha;

  runner.benchmark(userId, repo, filename, sha, function(error, result) {
    res.end('cool');
  });
});


app.error(function(error, req, res, next) {
  var codeMessage = error.message.split(':');
  var errorCode = codeMessage[0] || '';
  var message = codeMessage[1] || '';

  var httpCodeMap = {
    invalid: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    server: 500,
  };

  var httpCode = httpCodeMap[errorCode] ? httpCodeMap[errorCode] : null;
  if (httpCode === null) { logger.error(new Error('invalid error code')); httpCode = 500; }

  logger.error(error);
  return res.send(httpCode);
});

// start listening
app.listen(appConfig.port);
logger.log({ message: 'server start', port: app.address().port });
