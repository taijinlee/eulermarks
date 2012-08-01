
module.exports = function(app, middlewares, handlers) {

  app.post('/api/user', function(req, res, next) {
    var userData = req.body;
    handlers.user.create(userData, function(error, userData) {
      if (error) { return next(error); }
      return res.json(userData);
    });
  });

  app.get('/api/user/:userId', middlewares.entity.exists('user'), function(req, res, next) {
    handlers.user.retrieve(req.auth.tokenUserId, req.params.userId, function(error, data) {
      if (error) { return next(error); }
      return res.json(data);
    });
  });

  app.put('/api/user/:userId', middlewares.auth.requireLogin, middlewares.entity.exists('user'), function(req, res, next) {
    var updateData = req.body;
    handlers.user.update(req.auth.tokenUserId, req.params.userId, updateData, function(error) {
      if (error) { return next(error); }
      return res.end('ok');
    });
  });

  app.del('/api/user/:userId', middlewares.auth.requireLogin, middlewares.entity.exists('user'), function(req, res, next) {
    handlers.user.destroy(req.auth.tokenUserId, req.params.userId, function(error) {
      if (error) { return next(error); }
      return res.end('ok');
    });
  });

  app.get('/api/user', null /* TODO: new handler to list users based on search */);

  // returns all the activities for user :userId that is visible to the requesting
  // users
  app.get('api/user/:userId/recent_activity', null /* new handler */);

};
