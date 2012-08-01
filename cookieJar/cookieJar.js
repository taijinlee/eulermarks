
module.exports = function() {

  var cookieName = 'c';
  var currCookie = {};

  var init = function(reqCookies) {
    currCookie = reqCookies[cookieName] ? JSON.parse(reqCookies[cookieName]) : {};
  };

  var get = function(key) {
    return currCookie.hasOwnProperty(key) ? currCookie[key] : undefined;
  };

  // set or overwrite an existing key / value pair
  var set = function(key, value) {
    currCookie[key] = value;
  };

  var del = function(key) {
    if (!currCookie.hasOwnProperty(key)) { return false; }
    delete currCookie[key];
    return true;
  };

  var cookie = function() {
    return [cookieName, JSON.stringify(currCookie), { path: '/', maxAge: 2592000000 /* 30 days */ }];
  };

  return {
    init: init,
    get: get,
    set: set,
    del: del,
    cookie: cookie
  };

};
