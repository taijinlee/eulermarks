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
        login: { type: 'string' },
        role: { type: 'userRole', defaults: 'user' },
        avatarUrl: { type: 'string' },
        token: { type: 'string' },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};
