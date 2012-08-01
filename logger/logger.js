
module.exports = function() {

  var serverLogFormat = function() {
    var format = {
      date: ':date',
      status: ':status',
      response_time: ':response-time',
      method: ':method',
      url: ':url',
      referrer: ':referrer',
      user_agent: ':user-agent',
      remote_addr: ':remote-addr',
      http_version: ':http-version',
      reqHeader: ':req',
      resHeader: ':res'
    };
    return JSON.stringify(format);
  };

  var serverLogFormatDev = function() {
    var format = {
      date: ':date',
      status: ':status',
      response_time: ':response-time',
      method: ':method',
      url: ':url',
      referrer: ':referrer',
      reqHeader: ':req',
      resHeader: ':res'
    };
    return JSON.stringify(format);
  };

  var error = function(error) {
    var format = {
      message: error.message,
      stack: error.stack
    };
    log(format);
  };

  var log = function(obj) {
    console.log(JSON.stringify(obj));
  };

  return {
    serverLogFormat: serverLogFormat,
    serverLogFormatDev: serverLogFormatDev,
    error: error,
    log: log
  };
};
