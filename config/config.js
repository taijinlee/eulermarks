module.exports = function() {

  var config = require('config');

  console.log(config.app.host);

  config.makeHidden(config.githubOauth, 'secret');
  config.makeHidden(config.app, 'port');
  config.makeHidden(config.benchmarker, 'port');

  return config;

};
