
module.exports = function(app, middlewares, handlers) {
  var config = require(process.env.APP_ROOT + '/config/config.js')();

  app.get('/api/config', function(req, res, next) {
    return res.json(config);
  });

};
