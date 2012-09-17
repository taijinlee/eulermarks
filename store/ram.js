var sift = require('sift');
var _ = require('underscore');

module.exports = function(host, port) {

  // don't care about host or port
  var open = function(callback) {
    return callback();
  };
  var close = open;

  // everything gets stored against this connection object
  var data = {};

  var currId = 0;

  var generateId = function() {
    currId++;
    return currId.toString();
  };

  // id is fine here, so no encoding necessary
  var idEncode = function(obj) {
    return obj;
  };
  var idDecode = function(obj) {
    return obj;
  };



  function createDatabaseCollection(database, collection) {
    if (data[database] === undefined) {
      data[database] = {};
    }
    if (data[database][collection] === undefined) {
      data[database][collection] = [];
    }
  }


  var insert = function(obj, context, callback) {
    createDatabaseCollection(context.database, context.collection);

    if (sift({ id: obj.id }, data[context.database][context.collection]).length > 0) {
      return callback(new Error('id collision'));
    }
    data[context.database][context.collection].push(obj);
    return callback(null, obj);
  };

  var retrieve = function(criteria, context, options, callback) {
    return query(criteria, context, options, function(error, items) {
      if (error) { return callback(error); }
      return callback(null, items[0]);
    });
  };

  var update = function(criteria, obj, context, callback) {
    createDatabaseCollection(context.database, context.collection);

    criteria = idEncode(criteria);

    var sifted = sift(criteria, data[context.database][context.collection]);
    for (var i in sifted) {
      for (var prop in obj) {
        sifted[i][prop] = obj[prop];
      }
    }

    return callback(null);
  };

  var upsert = function(criteria, obj, context, callback) {
    createDatabaseCollection(context.database, context.collection);

    criteria = idEncode(criteria);
    retrieve(criteria, context, {}, function(error, data) {
      if (!data) { return insert(_.extend(criteria, obj), context, callback); }
      return update(criteria, obj, context, callback);
    });
  };

  var destroy = function(criteria, context, callback) {
    createDatabaseCollection(context.database, context.collection);

    criteria = idEncode(criteria);
    var sifted = sift(criteria, data[context.database][context.collection]);
    for (var i in sifted) {
      var index = data[context.database][context.collection].indexOf(sifted[i]);
      data[context.database][context.collection].splice(index, 1);
    }

    return callback(null);
  };

  var query = function(criteria, context, options, callback) {
    createDatabaseCollection(context.database, context.collection);
    criteria = idEncode(criteria);

    return callback(null, sift(criteria, data[context.database][context.collection]));
  };

  return {
    insert: insert,
    retrieve: retrieve,
    update: update,
    upsert: upsert,
    destroy: destroy,
    query: query,

    generateId: generateId,
    idEncode: idEncode,
    idDecode: idDecode
  };
};
