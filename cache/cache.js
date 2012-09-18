
module.exports = function() {

  var Lru = require('lru-cache');
  var lru = new Lru({ max: 100, length: function(item) { return item.length ? item.length : 1; }, maxAge: 1000 * 60 * 60 });

  var set = function(keyObj, value, callback) {
    var cacheKey = JSON.stringify(keyObj);
    if (!lru.set(cacheKey, value)) {
      console.log('lru cache store error'); // TODO: make this more robust
    }

    return callback(null, value);
  };

  var get = function(keyObj, callback) {
    var cacheKey = JSON.stringify(keyObj);
    if (lru.get(cacheKey)) { return callback(null, lru.get(cacheKey)); }
    return callback(null, null);
  };

  return {
    set: set,
    get: get
  };


};
