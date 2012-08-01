
module.exports = function(store, cookieJar) {

  // called globally before all routing
  var init = function(req, res, next) {
    cookieJar.init(req.cookies);
    return next();
  };

  return {
    init: init
  };

};
