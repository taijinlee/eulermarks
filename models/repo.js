module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/repo'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'eulermarks', collection: 'repos' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        userId: { type: 'string' },
        name: { type: 'string' },
        htmlUrl: { type: 'url' },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
