
module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'backbone-web'
  ], function(BackboneServerModel) {

    ServerModel = BackboneServerModel.extend({
      store: store,
      context: { database: 'eulermarks', collection: 'assetBlobs' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        hash: { type: 'string' },
        blob: { type: 'object' },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
