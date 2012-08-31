
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

  var getFiles = function(userLogin, repo, callback) {
    async.auto({
      latestCommit: function(done) {
        github.repos.getCommits({ user: userLogin, repo: repo, page: 1, per_page: 1 }, function(error, commits) {
          if (error) { return done(error); }
          var latestCommit = commits.shift();
          return done(null, latestCommit.sha);
        });
      },
      repoTree: ['latestCommit', function(done, results) {
        github.gitdata.getTree({ user: userLogin, repo: repo, sha: results.latestCommit, recursive: true }, function(error, repoTree) {
          if (error) { return done(error); }
          return done(null, repoTree.tree);
        });
      }]
    }, function(error, results) {
      if (error) { return callback(error); }
      return callback(null, results.repoTree);
    });
  };

  var getFile = function(userLogin, repo, sha, callback) {
    github.gitdata.getBlob({ user: userLogin, repo: repo, sha: sha }, function(error, results) {
      if (error) { return callback(error); }
      return callback(null, new Buffer(results.content, 'base64').toString());
    });
  };

  return {
    login: login,
    repoTransform: repoTransform,
    userGithubRepos: userGithubRepos,
    getFiles: getFiles,
    getFile: getFile
  };

};
