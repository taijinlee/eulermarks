
module.exports = function() {

  var fs = require('fs');
  var exec = require('child_process').exec;
  var async = require('async');
  var request = require('request');
  var appConfig = require('config').app;

  var github = require(process.env.APP_ROOT + '/github/github.js')();

  var benchmark = function(userId, repo, filename, sha, callback) {
    async.auto({
      fetchGithubFile: async.apply(github.getFile, userId, repo, sha),
      tmpStoreGithubFile: ['fetchGithubFile', function(done, results) {
        fs.writeFile('/tmp/a', results.fetchGithubFile, done);
      }],
      runFile: ['tmpStoreGithubFile', function(done) {
        var start = new Date().getTime();
        exec('/usr/bin/time node /tmp/a', function(error, stdout, stderr) {
          if (error) { return done(error); }
          return done(null, { runTime: new Date().getTime() - start });
        });
      }],
      sendResults: ['runFile', function(done, results) {
        var runData = {
          userId: userId,
          repoId: repo,
          filename: filename,
          sha: sha,
          results: results.runFile
        };
        request.post({ url: 'http://' + appConfig.host + '/api/benchmarkRun', json: runData }, done);
      }],
    }, function(error, result) {
      if (error) { return callback(error); }
      return callback(null, result);
    });
  };

  return {
    benchmark: benchmark
  };

};
