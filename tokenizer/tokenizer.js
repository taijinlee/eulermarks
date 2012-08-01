
var crypto = require('crypto');
module.exports = function() {

  var generate = function(salt, tokenize, time, timeToLive) {
    return crypto.createHmac('sha256', '' + salt).update('' + tokenize).update('' + time).update('' + timeToLive).digest('base64');
  };

  var match = function(salt, tokenize, time, timeToLive, token) {
    if (token === generate(salt, tokenize, time, timeToLive)) {
      var now = new Date().getTime();
      if (!timeToLive) { return true; }
      if (now < time + timeToLive) { return true; }
    }
    return false;
  };

  var generateSalt = function() {
    var salt = null;
    try {
      salt = crypto.randomBytes(256).toString('base64');
    } catch (ex) {
      // handle error in other way too?
    }
    return salt;
  };

  return {
    generate: generate,
    match: match,
    generateSalt: generateSalt
  };

};
