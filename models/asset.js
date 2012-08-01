
module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'backbone-web'
  ], function(BackboneServerModel) {

    ServerModel = BackboneServerModel.extend({
      store: store,
      context: { database: 'eulermarks', collection: 'assets' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        refId: { type: 'string' },
        refContext: { type: 'string' },
        assetBlobHash: { type: 'string' },
        metadata: { type: 'object' },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); }}
      }

    });


  });

  return ServerModel;
};
