
module.exports = function(app, middleware, handlers) {

  app.post('/api/benchmarkRun', function(req, res, next) {
    var runData = req.body;
    handlers.benchmarkRun.create(runData, function(error, runData) {
      if (error) { return next(error); }
      return res.json(runData);
    });
  });

};
