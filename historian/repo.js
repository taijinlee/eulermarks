
module.exports = function(store) {
  var async = require('async');
  var github = require(process.env.APP_ROOT + '/github/github.js')();

  var RepoModel = require(process.env.APP_ROOT + '/models/repo.js')(store);
  var BenchmarkRunQueue = require(process.env.APP_ROOT + '/models/benchmarkRunQueue.js')(store);

  var create = function(repoData, callback) {
    async.auto({
      createRepo: function(done) {
        return new RepoModel(repoData).create(done);
      },
      queueBenchmarks: function(done) {
        github.getFiles(repoData.userId, repoData.name, function(error, files) {
          if (error) { return done(error); }
          async.forEach(files, function(file, eachDone) {
            if (file.type !== 'blob') { return eachDone(); }

            var runQueue = {
              id: store.generateId(),
              repoId: repoData.id,
              userId: repoData.userId,
              repo: repoData.name,
              filename: file.path,
              sha: file.sha
            };
            new BenchmarkRunQueue(runQueue).create(eachDone);
          }, done);
        });
      }
    }, function(error, results) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  var update = function(criteria, params, callback) {
    return new RepoModel(params).update(criteria, callback);
  };

  var remove = function(id, callback) {
    async.auto({
      removeRepo: function(done) {
        new RepoModel({ id: id }).remove(done);
      },
      removeBenchmarkQueue: function(done) {
        new BenchmarkRunQueue({ repoId: id }).remove(done);
      }
    }, function(error, results) {
      if (error) { return callback(error); }
      return callback(null);
    });
  };

  return {
    create: create,
    update: update,
    remove: remove
  };

};

