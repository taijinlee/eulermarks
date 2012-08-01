
module.exports = function(store) {

  var crypto = require('crypto');
  var async = require('async');
  var AssetBlob = require(process.env.APP_ROOT + '/models/assetBlob.js')(store);
  var Asset = require(process.env.APP_ROOT + '/models/asset.js')(store);

  var hash = function(blob) {
    return crypto.createHash('sha256').update(blob).digest('base64').replace(/\//g, '-');
  };

  var save = function(assetId, refId, refContext, blob, callback) {
    async.waterfall([
      function(next) {
        // get or create assetBlob
        var assetBlob = new AssetBlob({
          id: store.generateId(),
          blob: blob,
          hash: hash(blob),
          created: new Date().getTime()
        });
        return assetBlob.create(function(error) {
          if (error && error.message !== 'conflict') { return next(error); }
          return next(null, assetBlob.get('hash'));
        });
      },
      function(assetBlobHash, next) {
        var asset = new Asset({
          id: assetId,
          refId: refId,
          refContext: refContext,
          assetBlobHash: assetBlobHash,
          metadata: {},
          created: new Date().getTime()
        });
        asset.create(function(error) {
          if (error) { return next(error); }
          return next(null, asset.get('id'));
        });
      }
    ], function(error, assetId) {
      if (error) { return callback(error); }
      return callback(null, assetId);
    });
  };

  var getUrl = function(assetId, callback) {
    var defaultUrl = 'https://www.google.com/images/srpr/logo3w.png';
    if (!assetId) { return callback(null, defaultUrl); }

    var asset = new Asset({ id: assetId });
    asset.retrieve(function(error) {
      if (error) { return callback(error); }
      // if s3 down then return a different url: unimplemented

      var url = '//' + process.env.APP_HOST + '/asset/' + asset.get('assetBlobHash');
      return callback(null, url);
    });
  };

  var destroy = function(assetId, callback) {

  };


  var list = function(criteria, callback) {
    return callback(new Error ('unimplemented'));
  };



  return {
    hash: hash,
    save: save,
    getUrl: getUrl,
    destroy: destroy,
    list: list
  };

};
