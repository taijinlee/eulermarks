
var mongo = require('mongodb');
var _ = require('underscore');

module.exports = function(host, port) {

  var getConn = function(host, port) {
    var mongoServer = new mongo.Server(host, port);
    return new mongo.Db('dummyGetsOverwritten' /* default db */, mongoServer);
  };

  var getStackTrace = function() {
    return new Error().stack;
  };

  var applyStackTrace = function(error, stackTrace) {
    error.stack = stackTrace;
    return error;
  };

  var generateId = function() {
    return mongo.ObjectID.createPk().toString();
  };

  var idEncode = function(_obj) {
    if (!_obj.hasOwnProperty('id')) { return _obj; }

    var obj = _.clone(_obj);
    obj._id = String(obj.id);
    delete obj.id;
    return obj;
  };

  var idDecode = function(obj) {
    if (!obj || obj._id === undefined) { return obj; }
    obj.id = String(obj._id);
    delete obj._id;
    return obj;
  };

  var insert = function(obj, context, callback) {
    var conn = getConn(host, port);
    var stackTrace = getStackTrace();
    conn.open(function() {
      var db = conn.db(context.database);
      obj = idEncode(obj);
      db.collection(context.collection).insert(obj, {safe: true}, function(error, data) {
        if (error) { return callback(translateError(error, stackTrace)); }
        conn.close();
        callback(null, idDecode(data.shift()));
      });
    });
  };

  var retrieve = function(criteria, context, options, callback) {
    return query(criteria, context, options, function(error, items) {
      if (error) { return callback(error); }
      return callback(null, items[0]);
    });
  };

  var update = function(criteria, obj, context, callback) {
    var conn = getConn(host, port);
    var stackTrace = getStackTrace();
    conn.open(function() {
      var db = conn.db(context.database);
      criteria = idEncode(criteria);
      // to sanitize the update
      delete(obj.id);
      delete(obj._id);
      db.collection(context.collection).update(criteria, {$set: obj}, {safe: true}, function(error) {
        if (error) { return callback(translateError(error, stackTrace)); }
        conn.close();
        return callback(null);
      });
    });
  };

  var upsert = function(criteria, obj, context, callback) {
    var conn = getConn(host, port);
    var stackTrace = getStackTrace();
    conn.open(function() {
      var db = conn.db(context.database);
      criteria = idEncode(criteria);
      // to sanitize the update
      delete(obj.id);
      delete(obj._id);
      db.collection(context.collection).update(criteria, {$set: obj}, {safe: true, upsert: true}, function(error) {
        if (error) { return callback(translateError(error, stackTrace)); }
        conn.close();
        return callback(null);
      });
    });
  };

  var destroy = function(criteria, context, callback) {
    var conn = getConn(host, port);
    var stackTrace = getStackTrace();
    conn.open(function() {
      var db = conn.db(context.database);
      criteria = idEncode(criteria);
      db.collection(context.collection).remove(criteria, {safe: true}, function(error) {
        if (error) { return callback(translateError(error, stackTrace)); }
        conn.close();
        return callback(null);
      });
    });
  };

  var query = function(criteria, context, options, callback) {
    var conn = getConn(host, port);
    var stackTrace = getStackTrace();

    conn.open(function() {
      var db = conn.db(context.database);
      criteria = idEncode(criteria);
      var results = db.collection(context.collection).find(criteria, options, function(error, cursor) {
        if (error) { return callback(translateError(error, stackTrace)); }
        cursor.toArray(function(error, data) {
          if (error) { return callback(translateError(error, stackTrace)); }
          conn.close();
          return callback(null, data.map(idDecode));
        });
      });
    });
  };

  var translateError = function(mongoError, stackTrace) {
    if (mongoError.code === 11000) {
      return applyStackTrace(new Error('conflict'), stackTrace);
    }
    return applyStackTrace(new Error(''), stackTrace);
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
    idDecode: idDecode,

  };
};
