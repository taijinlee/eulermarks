
module.exports = (function() {

  var datastore = 'mongo';
  var store = require(process.env.APP_ROOT + '/store/store.js')(datastore, 'localhost', 27017);
  var history = require(process.env.APP_ROOT + '/history/history.js')(store);
  var cron = require(process.env.APP_ROOT + '/cron/cron.js')();

  var interval = {
    millis: 1,
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000
  };

  cron.register(3 * interval.second, (require(process.env.APP_ROOT + '/app/handlers/benchmarkRunner.js')(store, history)).run);
  cron.run();
}());
