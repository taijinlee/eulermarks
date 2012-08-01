
module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'backbone-web'
  ], function (BackboneServerModel) {

    ServerModel = BackboneServerModel.extend({
      store: store,
      context: { database: 'eulermarks', collection: 'history' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        userId: { type: 'string' },
        subject: { type: 'string' },
        event: { type: 'string' },
        entityId: { type: 'object' },
        params: { type: 'object' },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
