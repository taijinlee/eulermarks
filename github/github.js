
module.exports = function() {

  var async = require('async');
  var _ = require('underscore');

  var Github = require('github');
  var github = new Github({
    version: "3.0.0"
  });

  var repoTransform = function(githubRepo, callback) {
    return callback(null, {
      userId: githubRepo.owner.login,
      name: githubRepo.name,
      htmlUrl: githubRepo.html_url
    });
  };

  var userGithubRepos = function(userId, callback) {
    github.repos.getFromUser({ user: userId }, function(error, repos) {
      if (error) { return error; }
      async.map(repos, repoTransform, callback);
    });
  };

  return {
    repoTransform: repoTransform,
    userGithubRepos: userGithubRepos
  };

};
