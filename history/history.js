
module.exports = function(store) {

  var HistoryModel = require(process.env.APP_ROOT + '/models/history.js')(store);
  var logger = require(process.env.APP_ROOT + '/logger/logger.js')();

  var record = function(userId, subject, event, subjectId, params, callback) {
    var history = new HistoryModel({
      id: store.generateId(),
      userId: userId,
      subject: subject,
      event: event,
      entityId: subjectId,
      params: params
    });

    history.create(function(error) {
      if (error) { return callback(error); }
      return callback(null, history.toJSON());
    });

    /* async call to historian to interpret history only called in dev */
    if (process.env.NODE_ENV === 'dev') {
      params.push(function(error) {
        // log error on error, otherwise no need to do anything
        if (error) { return logger.error(error); }
      });
      var historian = require(process.env.APP_ROOT + '/historian/' + subject + '.js')(store);
      historian[event].apply(null, params);
    }
  };

  return {
    record: record
  };

};
