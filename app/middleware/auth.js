
module.exports = function(store, cookieJar) {

  var async = require('async');
  var _ = require('underscore');
  var Github = require('github');
  var tokenizer = require(process.env.APP_ROOT + '/tokenizer/tokenizer.js')();
  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var salt = 'Plubrl#mla!2lUCleFluSTouW@i@SWoA';

  // called globally before all routing
  var getTokenUserId = function(req, res, next) {
    req.auth = req.auth || {};
    req.auth.tokenUserId = false;

    var loginToken = cookieJar.get('login');
    if (!loginToken) { return next(null); }

    var userId = loginToken.slice(0, loginToken.indexOf(':'));
    var tokenParts = loginToken.split(':');
    tokenParts.unshift(salt);

    if (tokenizer.match.apply(null, tokenParts)) { req.auth.tokenUserId = userId; }
    return next(null);
  };

  var isRole = function(role) {
    return function(req, res, next) {
      async.series([
        async.apply(requireLogin, req, res),
        function(done) {
          var user = new UserModel({ id: req.auth.tokenUserId });
          user.retrieve(function(error, userData) {
            if (error) { return next(error); }
            if (userData.role !== role) { return next(new Error('unauthorized')); }
            return done(null);
          });
        }
      ], function(error) {
        next(error);
      });
    };
  };

  // requires getTokenUserId to run before it
  var requireLogin = function(req, res, next) {
    if (req.auth.tokenUserId === false) { return next(new Error('unauthorized: require login')); }
    return next(null);
  };

  // requires getTokenUserId to run before it
  var requireLogout = function(req, res, next) {
    if (req.auth.tokenUserId !== false) { return next(new Error('unauthorized: require logout')); }
    return next(null);
  };


  var githubLogin = function(req, res, next, githubToken/* hack*/) {
    async.auto({
      githubUser: function(done) {
        var github = new Github({
          version: "3.0.0"
        });
        github.authenticate({
          type: 'oauth',
          token: githubToken
        });

        github.user.get({}, done);
      },
      user: ['githubUser', function(done, results) {
        if (_.isEmpty(results.githubUser)) {
          return done(new Error('internal: github failure: ' + JSON.stringify(results.githubUser)));
        }
        var userData = {
          id: results.githubUser.login,
          login: results.githubUser.login,
          email: results.githubUser.email,
          avatarUrl: String(results.githubUser.avatar_url),
          token: githubToken,
        };
        new UserModel(userData).upsert({ id: results.githubUser.login }, done);
      }]
    }, function(error, results) {
      if (error) { return next(error); }
      provisionToken(req, res, next, results.githubUser.login);
      // redirect back to homepage
      res.writeHead(303, {
        Location: '/'
      });
      res.end();
    });
  };

  var login = function(req, res, next) {
    async.auto({
      userData: function(done, results) {
        new UserModel({ email: req.body.email }).retrieve(done);
      },
      authenticate: ['userData', function(done, results) {
        var userData = results.userData;
        if (!userData || !tokenizer.match(userData.salt, req.body.password, 0, 0, userData.password)) {
          return done(new Error('unauthorized: incorrect password'));
        }
        return done(null);
      }]
    }, function(error, results) {
      if (error) { return next(error); }
      provisionToken(req, res, next, results.userData.id);
      return next(null);
    });
  };

  var provisionToken = function(req, res, next, userId /* hack */) {
    var ttl = 300000; /* 5 minutes */
    // give the user a good login cookie
    var time = (new Date()).getTime();
    var token = tokenizer.generate(salt, userId, time, ttl);

    cookieJar.set('userId', userId);
    cookieJar.set('login', [userId, time, ttl, token].join(':'));
    res.cookie.apply(res, cookieJar.cookie());
  };



  var logout = function(req, res, next) {
    cookieJar.del('userId');
    cookieJar.del('login');
    res.cookie.apply(res, cookieJar.cookie());
    return next();
  };


  return {
    getTokenUserId: getTokenUserId,
    isRole: isRole,
    requireLogin: requireLogin,
    requireLogout: requireLogout,
    login: login,
    githubLogin: githubLogin,
    logout: logout
  };
};
