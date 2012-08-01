module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/user'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'eulermarks', collection: 'users' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        email: { type: 'email' },
        password: { type: 'string' },
        role: { type: 'userRole', defaults: 'user' },
        imageAssetId: { type: 'string', optional: true },
        salt: { type: 'string', optional: true },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
