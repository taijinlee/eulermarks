
module.exports = function(store, history) {

  var fs = require('fs');
  var assetManager = require(process.env.APP_ROOT + '/assetManager/assetManager.js')(store);
  var AssetBlobModel = require(process.env.APP_ROOT + '/models/assetBlob.js')(store);
  var _ = require('underscore');

  /* Basic crud */
  var create = function(tokenUserId, refId, refContext, blob, callback) {
    var assetId = store.generateId();
    history.record(tokenUserId, 'asset', 'create', assetId, [assetId, refId, refContext, blob], function(error) {
      if (error) { return callback(error); }
      return callback(null, assetId);
    });
  };

  var retrieve = function(tokenUserId, assetHash, callback) {
    var assetBlob = new AssetBlobModel({ hash: assetHash });
    assetBlob.retrieve(function(error) {
      if (error) { return callback(error); }
      fs.writeFile(process.env.APP_ROOT + process.env.WEB_ROOT + '/asset/' + assetHash, assetBlob.get('blob').buffer, callback);
    });
  };

  var destroy = function(tokenUserId, assetHash, callback) {
    // unimplemented
    // maybe do some user validation of sorts in the future

    history.record(tokenUserId, 'asset', 'remove', assetHash, [assetHash], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  return {
    create: create,
    retrieve: retrieve
  };

};
