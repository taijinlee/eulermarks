
module.exports = function(store, history) {

  var BenchmarkRunModel = require(process.env.APP_ROOT + '/models/benchmarkRun.js')(store);
  var WebBenchmarkRunModel = require(process.env.APP_ROOT + '/models/webModel.js')('benchmarkRun');

  var create = function(runData, callback) {
    runData.id = store.generateId();
    var benchmarkRun = new BenchmarkRunModel(runData);
    if (!benchmarkRun.isValid()) { return callback(new Error('invalid')); }

    history.record('!system-internal', 'benchmarkRun', 'create', runData.id, [benchmarkRun.toJSON()], function(error, historyData) {
      if (error) { return callback(error); }
      var webBenchmarkRun = new WebBenchmarkRunModel(benchmarkRun.toJSON()).toJSON();
      return callback(null, webBenchmarkRun);
    });
  };

  return {
    create: create
  };

};
