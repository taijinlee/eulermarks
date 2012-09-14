
module.exports = function(store) {
  var async = require('async');
  var supportedFileTypes = require(process.env.APP_ROOT + '/config/config.js')().supportedFileTypes;
  var github = require(process.env.APP_ROOT + '/github/github.js')();

  var RepoModel = require(process.env.APP_ROOT + '/models/repo.js')(store);
  var RepoFileModel = require(process.env.APP_ROOT + '/models/repoFile.js')(store);
  var BenchmarkRunQueue = require(process.env.APP_ROOT + '/models/benchmarkRunQueue.js')(store);

  var create = function(repoData, callback) {
    var fileMatcher = new RegExp('\\d+([-\\w+]*)\\.(' + supportedFileTypes.join('|') + ')$');

    async.auto({
      createRepo: function(done) {
        return new RepoModel(repoData).create(done);
      },
      githubFiles: function(done) {
        github.getFiles(repoData.userId, repoData.name, function(error, files) {
          if (error) { return done(error); }

          async.filter(files, function(file, filterdone) {
            if (file.type !== 'blob' || fileMatcher.exec(file.path) === null) { return filterdone(false); }
            return filterdone(true);
          }, function(filteredFiles) {
            return done(null, filteredFiles);
          });
        });
      },
      repoFiles: ['githubFiles', function(done, results) {
        async.forEach(results.githubFiles, function(file, eachDone) {
          new RepoFileModel({
            id: repoData.id + ':' + file.path,
            repoId: repoData.id,
            filename: file.path,
            results: null
          }).create(eachDone);
        }, done);
      }],
      queueBenchmarks: ['githubFiles', function(done, results) {
        async.forEach(results.githubFiles, function(file, eachDone) {
          new BenchmarkRunQueue({
            id: store.generateId(),
            repoId: repoData.id,
            userId: repoData.userId,
            repo: repoData.name,
            filename: file.path,
            sha: file.sha
          }).create(eachDone);
        }, done);
      }]
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
      removeRepoFiles: function(done) {
        new RepoFileModel({ repoId: id }).remove(done);
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

