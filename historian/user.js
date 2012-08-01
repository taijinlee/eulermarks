
module.exports = function(store) {
  var async = require('async');
  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);

  var create = function(userData, callback) {
    async.auto({
      user: function(done, results) {
        new UserModel(userData).create(done);
      }
    }, function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var update = function(criteria, params, callback) {
    var user = new UserModel(params);
    return user.update(criteria, callback);
  };

  var remove = function(id, callback) {
    var user = new UserModel({ id: id });
    return user.remove(callback);
  };

  return {
    create: create,
    update: update,
    remove: remove
  };

};
