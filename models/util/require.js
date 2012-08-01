
var requirejs = require('requirejs');
requirejs.config({
  baseUrl: process.env.APP_ROOT,
  paths: {
    // faking backbone-web to actually be our server version
    'backbone-web': process.env.APP_ROOT + '/models/util/backbone-server',
    // the real backbone-web is this one
    'backbone-web-real': process.env.APP_ROOT + '/models/util/backbone-web',
    'types': process.env.APP_ROOT + '/models/util/types',
  },

  nodeRequire: require
});

module.exports = requirejs;
