
module.exports = function(store) {
  var RepoModel = require(process.env.APP_ROOT + '/models/repo.js')(store);

  var create = function(repoData, callback) {
    return new RepoModel(repoData).create(callback);
  };

  var update = function(criteria, params, callback) {
    return new RepoModel(params).update(criteria, callback);
  };

  var remove = function(id, callback) {
    return new RepoModel({ id: id }).remove(callback);
  };

  return {
    create: create,
    update: update,
    remove: remove
  };

};

