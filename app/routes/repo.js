
module.exports = function(app, middlewares, handlers) {

  app.get('/api/repo/unregistered', middlewares.entity.exists('user'), function(req, res, next) {
    handlers.repo.unregistered(req.param('userId'), function(error, repos) {
      if (error) { return next(error); }
      return res.json(repos);
    });
  });

  app.post('/api/repo', middlewares.auth.requireLogin, function(req, res, next) {
    var repoData = req.body;
    handlers.repo.create(req.auth.tokenUserId, repoData, function(error, repoData) {
      if (error) { return next(error); }
      return res.json(repoData);
    });
  });

  app.get('/api/repo/:repoId', middlewares.entity.exists('repo'), function(req, res, next) {
    handlers.repo.retrieve(req.auth.tokenUserId, req.params.repoId, function(error, data) {
      if (error) { return next(error); }
      return res.json(data);
    });
  });

  app.put('/api/repo/:repoId', middlewares.auth.requireLogin, middlewares.entity.exists('repo'), function(req, res, next) {
    var updateData = req.body;
    handlers.repo.update(req.auth.tokenUserId, req.params.repoId, updateData, function(error) {
      if (error) { return next(error); }
      return res.json({});
    });
  });

  app.del('/api/repo/:repoId', middlewares.auth.requireLogin, middlewares.entity.exists('repo'), function(req, res, next) {
    handlers.repo.destroy(req.auth.tokenUserId, req.params.repoId, function(error) {
      if (error) { return next(error); }
      return res.json({});
    });
  });

  app.get('/api/repo', function(req, res, next) {
    // TODO: do user checking to make sure they have access? right now only public repos, so we're ok
    var limit = 0;
    var skip = 0;
    var filters = req.query;

    handlers.repo.list(filters, limit, skip, function(error, repos) {
      if (error) { return next(error); }
      return res.json(repos);
    });
  });

};
