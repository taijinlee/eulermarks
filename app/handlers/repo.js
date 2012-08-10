
module.exports = function(store, history) {
  var async = require('async');
  var _ = require('underscore');

  var RepoModel = require(process.env.APP_ROOT + '/models/repo.js')(store);
  var WebRepoModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'repo');

  /* Basic crud */
  var create = function(repoData, callback) {
    repoData.id = store.generateId();
    var repo = new RepoModel(repoData);
    if (!repo.isValid()) { return callback(new Error('Invalid')); }

    history.record(repoData.id, 'repo', 'create', repoData.id, [repo.toJSON()], function(error) {
      var webRepo = new WebRepoModel(repo.toJSON()).toJSON();
      return callback(null, webRepo);
    });
  };

  var retrieve = function(tokenUserId, repoId, callback) {
    var repo = new RepoModel({ id: repoId });
    if (!repo.isExistingFieldsValid()) { return callback(new Error('invalid')); }

    return repo.retrieve(callback);
  };

  var update = function(tokenUserId, repoId, updateData, callback) {
    // TODO: check for repository ownership... in routes?
    // if (tokenUserId !== repoId) { return callback(new Error('unauthorized')); }

    var repo = new RepoModel(_.extend({ id: repoId }, updateData), { parse: true });
    if (!repo.isExistingFieldsValid()) { return callback(new Error('invalid')); }

    history.record(tokenUserId, 'repo', 'update', repoId, [{ id: repoId }, updateData], function(error) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var destroy = function(tokenUserId, repoId, callback) {
    // TODO: check for repository ownership... in routes?
    // if (tokenUserId !== repoId) { return callback(new Error('unauthorized')); }
    var repo = new RepoModel({ id: repoId });
    if (!repo.isExistingFieldsValid()) { return callback(new Error('invalid')); }

    history.record(tokenUserId, 'repo', 'remove', repoId, [repoId], callback);
  };

  var list = function(filters, limit, skip, callback) {
    RepoModel.prototype.list(filters, limit, skip, function(error, repos) {
      if (error) { return callback(error); }
      return callback(null, repos);
    });
  };

  return {
    create: create,
    retrieve: retrieve,
    update: update,
    destroy: destroy,
    list: list
  };

};
