
module.exports = function(store) {
  var async = require('async');

  var assetManager = require(process.env.APP_ROOT + '/assetManager/assetManager.js')(store);
  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);

  var create = function(assetId, refId, refContext, blob, callback) {
    async.series([
      function(next) {
        switch (refContext) {
        case 'user':
          var user = new UserModel({ imageAssetId: assetId });
          user.update({ id: refId }, next);
          break;
        }
      },
      function(next) {
        return assetManager.save(assetId, refId, refContext, blob, callback);
      }
    ]);
  };

  return {
    create: create
  };

};
