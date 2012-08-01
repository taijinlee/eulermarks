
module.exports = function(app, store, history) {

  var fs = require('fs');
  var async = require('async');
  var _ = require('underscore');
  var logger = require(process.env.APP_ROOT + '/logger/logger.js')();
  var cookieJar = require(process.env.APP_ROOT + '/cookieJar/cookieJar.js')();

  var recursiveReaddirSync = function(path) {
    var files = fs.readdirSync(path);
    async.map(files, function(file, done) {
      var fullPath = path + '/' + file;
      if (fs.statSync(fullPath).isDirectory()) {
        var recursedFiles = recursiveReaddirSync(fullPath);
        return done(null, _.map(recursedFiles, function(recursedFile) { return file + '/' + recursedFile; }));
      }
      return done(null, file);
    }, function(error, results) {
      files = _.flatten(results);
    });
    return files;
  };

  // load all middleware
  var middlewareFiles = recursiveReaddirSync(process.env.APP_ROOT + '/app/middleware');
  var middlewares = {};
  middlewareFiles.forEach(function(file) {
    middlewares[file.replace('.js', '')] = require(process.env.APP_ROOT + '/app/middleware/' + file)(store, cookieJar);
  });

  // load all handlers
  var handlerFiles = recursiveReaddirSync(process.env.APP_ROOT + '/app/handlers');
  var handlers = {};
  handlerFiles.forEach(function(relativeFilePath) {
    var levels = relativeFilePath.replace('.js', '').split('/');
    var handlersLevelRef = handlers;
    for (var i = 0; i < levels.length-1; i++) {
      if (handlersLevelRef[levels[i]] === undefined) { handlersLevelRef[levels[i]] = {}; }
      handlersLevelRef = handlersLevelRef[levels[i]];
    }
    handlersLevelRef[levels[i]] = require(process.env.APP_ROOT + '/app/handlers/' + relativeFilePath)(store, history);
  });

  // load all api pre-routes
  var preRouteFiles = recursiveReaddirSync(process.env.APP_ROOT + '/app/preRoutes');
  preRouteFiles.forEach(function(file) {
    require(process.env.APP_ROOT + '/app/preRoutes/' + file)(app, middlewares, handlers);
  });

  // load all api routes
  var routeFiles = recursiveReaddirSync(process.env.APP_ROOT + '/app/routes');
  routeFiles.forEach(function(file) {
    require(process.env.APP_ROOT + '/app/routes/' + file)(app, middlewares, handlers);
  });

  app.all('/api/*', function(req, res, next) {
    // if an api request falls through, then let's not let it fall through to catch all
    var error = new Error('Invalid request');
    error.code = 404;
    return next(error);
  });

  // capturing non-api request routes
  app.all('*', function(req, res, next) {
    var html = fs.readFileSync(process.env.APP_ROOT + '/web/layout.html', 'utf8');
    res.end(html);
    return; // breaking here for now

    var jsdom = require('jsdom');
    var markup = fs.readFileSync(process.env.APP_ROOT + '/web/layout.html', 'utf8');

    jsdom.env({
      html: markup,
      url: 'http://localhost:3000/',
      features: {
        FetchExternalResources   : ['script'],
        ProcessExternalResources : ['script'],
        MutationEvents           : '2.0',
        QuerySelector            : false
      },
      done: function(errors, window) {
        window.location.pathname = req.url;
        window.location.search = '';
        window.location.hash = '';

        var html = window.document.innerHTML;
        res.end(html);
      }
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

};
