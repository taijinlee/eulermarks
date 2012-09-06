
module.exports = function(store, history) {

  var request = require('request');
  var BenchmarkRunQueue = require(process.env.APP_ROOT + '/models/benchmarkRunQueue.js')(store);

  /* run via cron */
  var run = function() {
    new BenchmarkRunQueue().retrieve(function(error, nextRun) {
      console.log(nextRun);
      var body = {
        userId: nextRun.userId,
        repo: nextRun.repo,
        filename: nextRun.filename,
        sha: nextRun.sha
      };

      request.post({ url: 'http://localhost:5000/bench', json: body }, function(error, response, body) {
        console.log(error);
        // console.log(response);
        console.log(body);
        new BenchmarkRunQueue({ id: nextRun.id }).remove(function(error) {
          console.log(error);
        });
      });

    });
  };

  return {
    run: run
  };


};
