
module.exports = function(app, middlewares, handlers) {

  app.get('/api/repoFile/:id');

  app.get('/api/repoFile', function(req, res, next) {
    var limit = 0;
    var skip = 0;
    var filters = req.query;

    handlers.repoFile.list(filters, limit, skip, function(error, repoFiles) {
      if (error) { return next(error); }
      return res.json(repoFiles);
    });

  });

};
