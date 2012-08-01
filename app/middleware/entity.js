
module.exports = function(store, cookieJar) {

  var exists = function(modelName, param) {
    return function(req, res, next) {
      param = param || (modelName + 'Id');
      var modelId = req.param(param, null);
      if (modelId === undefined) { return next(new Error('notFound: ' + modelName + 'Id expected in parameters')); }

      var Model = require(process.env.APP_ROOT + '/models/' + modelName + '.js')(store);

      new Model({ id: modelId }).retrieve(function(error, modelData) {
        if (error) { return next(error); }
        if (!modelData) { return next(new Error('notFound: ' + modelName + 'Id: ' + modelId + ' does not exist')); }
        return next();
      });

    };
  };

  return {
    exists: exists
  };

};