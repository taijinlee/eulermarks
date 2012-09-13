
module.exports = function(store) {
  var async = require('async');
  var BenchmarkRunModel = require(process.env.APP_ROOT + '/models/benchmarkRun.js')(store);
  var RepoFileModel = require(process.env.APP_ROOT + '/models/repoFile.js')(store);

  var create = function(runData, callback) {
    async.auto({
      logRunData: function(done) {
        new BenchmarkRunModel(runData).create(done);
      },
      repoFileUpdate: ['logRunData', function(done, results) { // only to make sure that it didn't error out first
        // results have to be smarter later! need to look at all benchmarkRuns and see what the aggregate is
        new RepoFileModel({ results: runData.results }).update({ id: runData.repoId + ':' + runData.filename }, done);
      }]
    }, function(error, results) {
      if (error) { return callback(error); }
      return callback(null, results.logRunData);
    });
  };

  return {
    create: create
  };

};
