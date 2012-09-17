
var mongo = require('mongodb');
var async = require('async');
var _ = require('underscore');

var indexes = [
  { database: 'eulermarks', collection: 'repoFiles', index: { repoId: 1 } },
  { database: 'eulermarks', collection: 'repos', index: { userId: 1 } }
];

var mongoServer = new mongo.Server('localhost', 27017);
var conn = new mongo.Db('main' /* default db */, mongoServer);

conn.open(function(error, client) {

  var createIndex = function(database, collection, index, options) {
    return function(callback) {
      conn = conn.db(database);
      conn.collection(collection).ensureIndex(index, options, callback);
    };
  };
  var createIndexes = _.map(indexes, function(config) {
    return createIndex(config.database, config.collection, config.index, config.options);
  });

  async.series(
    createIndexes,
    function() {
      conn.close();
    }
  );

});
