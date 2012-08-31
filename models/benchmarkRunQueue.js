module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'backbone-web'
  ], function (BackboneServerModel) {

    ServerModel = BackboneServerModel.extend({
      store: store,
      context: { database: 'eulermarks', collection: 'benchmarkRunQueue' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        repoId: { type: 'string' },
        userId: { type: 'string' },
        repo: { type: 'string' },
        filename: { type: 'string' },
        sha: { type: 'string' },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
