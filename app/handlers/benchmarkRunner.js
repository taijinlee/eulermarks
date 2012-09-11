
module.exports = function(store, history) {

  var _ = require('underscore');
  var request = require('request');
  var BenchmarkRunQueue = require(process.env.APP_ROOT + '/models/benchmarkRunQueue.js')(store);

  /* run via cron */
  var run = function() {
    new BenchmarkRunQueue().retrieve(function(error, nextRun) {
      if (_.isEmpty(nextRun)) { return; }

      var body = {
        userId: nextRun.userId,
        repo: nextRun.repo,
        filename: nextRun.filename,
        sha: nextRun.sha
      };

      request.post({ url: 'http://localhost:5000/bench', json: body }, function(error, response, body) {
        if (error) { /* TODO: log this somehow! */ return; }
        new BenchmarkRunQueue({ id: nextRun.id }).remove(function(error) {
          if (error) { /* TODO: log this somehow! */ return; }
        });
      });

    });
  };

  return {
    run: run
  };


};
