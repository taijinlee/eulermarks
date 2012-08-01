
module.exports = function(app, middlewares, handlers) {

  app.all('/api/admin/*', middlewares.auth.isRole('admin'), function(req, res, next) {
    next(null);
  });

};
