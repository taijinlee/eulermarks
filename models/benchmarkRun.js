module.exports = function(store) {
  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var ServerModel;
  requirejs([
    'web/js/models/benchmarkRun'
  ], function (WebModel) {

    ServerModel = WebModel.extend({
      store: store,
      context: { database: 'eulermarks', collection: 'benchmarkRuns' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        userId: { type: 'string' },
        repo: { type: 'string' },
        file: { type: 'string' },
        results: { type: 'object' },
        created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
      }

    });

  });

  return ServerModel;
};

