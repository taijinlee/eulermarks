module.exports = function() {

  var config = require('config');

  config.makeHidden(config.githubOauth, 'secret');
  config.makeHidden(config.app, 'port');
  config.makeHidden(config.benchmarker, 'port');

  return config;

};
