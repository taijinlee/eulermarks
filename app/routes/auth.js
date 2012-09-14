
module.exports = function(app, middlewares, handlers) {

  var OAuth2 = require("oauth").OAuth2;
  var githubOauthConfig = require(process.env.APP_ROOT + '/config/config.js')().githubOauth;

  /**
   * Using email and password, logs in an existing user
   */
  /*
  app.post('/api/auth/login', middlewares.auth.requireLogout, middlewares.auth.login, function(req, res, next) {
    return res.end('ok'); // no error
  });
  */
  app.get('/api/auth/github', function(req, res, next) {
    if (!req.query.code) { return next(new Error('invalid: no github code')); }
    var oauth = new OAuth2(githubOauthConfig.clientId, githubOauthConfig.secret, "https://github.com", "/login/oauth/authorize", "/login/oauth/access_token");

    oauth.getOAuthAccessToken(req.query.code, {}, function(error, accessToken, refreshToken) {
      if (error) { return next(new Error('invalid: error from github: ' + error)); }
      handlers.auth.githubLogin(accessToken, function(error, userData) {
        if (error) { return next(error); }
        middlewares.auth.provisionToken(req, res, next, userData.id);
        // redirect to user's page
        res.writeHead(303, {
          Location: '/' + userData.id
        });
        return res.end();
      });
    });
  });

  /**
   * Logs an existing user out from the system and invalid their credential cookie.
   */
  app.get('/api/auth/logout', middlewares.auth.requireLogin, middlewares.auth.logout, function(req, res, next) {
    return res.end('ok');
  });

};
