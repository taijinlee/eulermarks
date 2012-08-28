
module.exports = function() {

  var async = require('async');
  var _ = require('underscore');

  var Github = require('github');
  var github = new Github({
    version: "3.0.0"
  });

  var login = function(githubToken, callback) {
    async.auto({
      githubUser: function(done) {
        github.authenticate({
          type: 'oauth',
          token: githubToken
        });

        github.user.get({}, done);
      },
      user: ['githubUser', function(done, results) {
        if (_.isEmpty(results.githubUser)) {
          return done(new Error('internal: github failure: ' + JSON.stringify(results.githubUser)));
        }
        return done(null, {
          id: results.githubUser.login,
          login: results.githubUser.login,
          avatarUrl: String(results.githubUser.avatar_url),
          token: githubToken,
        });
      }]
    }, callback);
  };

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
    login: login,
    repoTransform: repoTransform,
    userGithubRepos: userGithubRepos
  };

};
