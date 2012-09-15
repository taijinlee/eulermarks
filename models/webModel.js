
module.exports = function(modelName) {

  var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

  var WebModel;
  requirejs([
    'web/js/models/' + modelName
  ], function(_WebModel) {
    WebModel = _WebModel;
  });

  return WebModel;
};
