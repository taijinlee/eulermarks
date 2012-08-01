
module.exports = function(store, modelName) {

  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');
  var ServerModel = require(process.env.APP_ROOT + '/models/' + modelName + '.js')(store);

  var WebModel;
  requirejs([
    'web/js/models/' + modelName
  ], function(_WebModel) {
    WebModel = _WebModel.extend({
      store: store,
      context: ServerModel.prototype.context
    });
  });

  return WebModel;
};
