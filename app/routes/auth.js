
module.exports = function(app, middlewares, handlers) {

  /**
   * Using email and password, logs in an existing user
   */
  app.post('/api/auth/login', middlewares.auth.requireLogout, middlewares.auth.login, function(req, res, next) {
    return res.end('ok'); // no error
  });

  /**
   * TODO: should this be its own method or should this doc be rolled up
   * to the above mapping?
   * Using OAuth, logs in an existing user into the system
   */
  app.post('/api/auth/login', null /* TODO: figure this out */);

  /**
   * Logs an existing user out from the system and invalid their credential cookie.
   */
  app.get('/api/auth/logout', middlewares.auth.requireLogin, middlewares.auth.logout, function(req, res, next) {
    return res.end('ok');
  });

};
