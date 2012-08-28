
module.exports = function(store) {
  var async = require('async');
  var BenchmarkRunModel = require(process.env.APP_ROOT + '/models/benchmarkRun.js')(store);

  var create = function(runData, callback) {
    new BenchmarkRunModel(runData).create(callback);
  };

  return {
    create: create
  };

};
