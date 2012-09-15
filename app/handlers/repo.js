
module.exports = function(store, history) {
  var async = require('async');
  var _ = require('underscore');

  var github = require(process.env.APP_ROOT + '/github/github.js')();
  var RepoModel = require(process.env.APP_ROOT + '/models/repo.js')(store);
  var WebRepoModel = require(process.env.APP_ROOT + '/models/webModel.js')('repo');

  /* Basic crud */
  var create = function(tokenUserId, repoData, callback) {
    if (tokenUserId !== repoData.userId) { return callback(new Error('unauthorized: can only create repos for yourself')); }

    repoData.id = repoData.userId + '/' + repoData.name;
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
    if (tokenUserId !== repoId.split('/')[0]) { return callback(new Error('unauthorized: cannot delete other peoples repos')); }

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

  var unregistered = function(userId, callback) {
    async.auto({
      githubRepos: async.apply(github.userGithubRepos, userId),
      registeredRepos: async.apply(list, { userId: userId }, 0, 0)
    }, function(error, results) {
      if (error) { return callback(error); }

      var registeredRepoNames = _.pluck(results.registeredRepos, 'name');
      var unregisteredRepos = _.filter(results.githubRepos, function(githubRepo) {
        if (_.include(registeredRepoNames, githubRepo.name)) { return false; }
        return true;
      });
      return callback(null, unregisteredRepos);
    });
  };

  return {
    create: create,
    retrieve: retrieve,
    update: update,
    destroy: destroy,
    list: list,
    unregistered: unregistered
  };

};
