
var dynamoConfig = require('config').stores.dynamo;
var dynode = require('dynode');
var mongo = require('mongodb');
var _ = require('underscore');

module.exports = function() {

  var getConn = _.memoize(function() {
    return new (dynode.Client)({
      accessKeyId: dynamoConfig.auth.accessKeyId,
      secretAccessKey: dynamoConfig.auth.secretAccessKey,
      tableNamePrefix: dynamoConfig.tableNamePrefix
    });
  });

  var getStackTrace = function() { return new Error().stack; };

  var applyStackTrace = function(error, stackTrace) {
    error.stack = stackTrace;
    return error;
  };

  var generateId = function() { return mongo.ObjectID.createPk().toString(); };
  var idEncode = function(obj) { return obj; };
  var idDecode = function(obj) { return obj; };

  var keyTransform = function(key) {
    if (key.primary) {
      key.hash = key.primary;
      delete key.primary;
    }
    return key;
  }

  var createTable = function(tableName, options, callback) {
    var conn = getConn();
    var stackTrace = getStackTrace();

    conn.createTable(tableName, options, function(error) {
      if (error) { return callback(translateError(error, stackTrace)); }
      return callback(null);
    });
  };

  var insert = function(obj, context, callback) {
    var conn = getConn();
    var stackTrace = getStackTrace();

    upsert({}, obj, context, function(error) {
      if (error) { return callback(translateError(error, stackTrace)); }
      return callback(null);
    });
  };

  // in this case criteria must be hash. One of the following: 'myHash' or { hash: 'myHashKey', range: 'myRangeKey' }
  // refer to http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_GetItem.html
  var retrieve = function(key, context, options, callback) {
    var conn = getConn();
    var stackTrace = getStackTrace();

    conn.getItem(context.collection, keyTransform(key), options, function(error, item, meta) {
      if (error) { return callback(translateError(error)); }
      return callback(null, item);
    });
  };

  var update = function(criteria, obj, context, callback) {
    var conn = getConn();
    var stackTrace = getStackTrace();

    conn.updateItem(context, criteria, obj, function(error) {
      if (error) { return callback(translateError(error, stackTrace)); }
      return callback(null);
    });
  };

  var upsert = function(criteria /* unused */, obj, context, callback) {
    var conn = getConn();
    var stackTrace = getStackTrace();
    var options = {};

    conn.putItem(context.collection, obj, options, function(error, consumedUnits) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  // http://docs.amazonwebservices.com/amazondynamodb/latest/developerguide/API_DeleteItem.html
  var destroy = function(key, context, callback) {
    var conn = getConn();
    var stackTrace = getStackTrace();

    conn.deleteItem(context.collection, keyTransform(key), function(error) {
      if (error) { return callback(translateError(error, stackTrace)); }
      return callback(null);
    });
  };


  var list = function(key, criteria, limit, lastId, context, callback) {
    var conn = getConn();
    var stackTrace = getStackTrace();

    if (!key.primary) {
      console.log(JSON.stringify({type: 'scan'}));
      return scan(criteria, context, limit, lastId, function(error, items) {
        if (error) { return callback(error); }
        return callback(null, items);
      });
    }

    if (!key.range) {
      console.log(JSON.stringify({type: 'query'}));
      return query(key.primary, criteria, context, limit, lastId, function(error, response) {
        if (error) { return callback(error); }
        return callback(null, response.Items);
      });
    }

    console.log(JSON.stringify({type: 'retrieve'}));
    return retrieve(key, context, {}, function(error, item) {
      if (error) { return callback(error); }
      return callback(null, [item]);
    });
  };


  /* Dynamo specific querying methods */
  var query = function(hash, criteria, context, limit, lastId, callback) {
    var conn = getConn();
    var stackTrace = getStackTrace();

    var options = {};
    if (limit) { options = _.extend(options, { Limit: limit }); }

    if (lastId) {
      if (!(lastId = createDynamoLastId(lastId))) { return callback(new Error('invalid: lastId not populated properly')); }
      options = _.extend(options, { ExclusiveStartKey: lastId });
    }

    conn.query(context.collection, hash, options, function(error, items, meta) {
      if (error) { return callback(translateError(error)); }
      // do some sifting via criteria and perhaps recursive queries until we have up to limit (or no more)
      return callback(null, items);
    });
  };

  var scan = function(criteria, context, limit, lastId, callback) {
    console.log(JSON.stringify(Array().slice.call(arguments)));
    var conn = getConn();
    var stackTrace = getStackTrace();

    var options = {};
    if (limit) { options = _.extend(options, { Limit: limit }); }

    if (lastId) {
      if (!(lastId = createDynamoLastId(lastId))) { return callback(new Error('invalid: lastId not populated properly')); }
      options = _.extend(options, { ExclusiveStartKey: lastId });
    }

    conn.scan(context.collection, options, function(error, items, meta) {
      if (error) { return callback(translateError(error)); }
      // do some sifting via criteria and perhaps recursive queries until we have up to limit (or no more)
      return callback(null, items);
    });
  };

  var createDynamoLastId = function(lastId) {
    if (!lastId.primary) { return false; }

    var key = { HashKeyElement: createDynamoTypedValue(lastId.primary) };
    if (lastId.range) {
      key = _.extend(key, { RangeKeyElement: createDynamoTypedValue(lastId.range) });
    }
    return key;
  };

  var createDynamoTypedValue = function(value) {
    var typedValue = {};
    typedValue[typeIndicator(value)] = value;
    return typedValue;
  };

  var typeIndicator = function(value) {
    if (_.isArray(value)) { return typeIndicator(_.first(value)) + 'S'; }
    return _.isNumber(value) ? 'N' : 'S';
  };




  var translateError = function(error, stackTrace) {
    return applyStackTrace(error, stackTrace);
  };


  return {
    createTable: createTable,

    insert: insert,
    retrieve: retrieve,
    list: list,

    update: update,
    upsert: upsert,
    destroy: destroy,

    generateId: generateId,
    idEncode: idEncode,
    idDecode: idDecode
  };
};
