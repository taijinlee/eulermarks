
module.exports = function(store, history) {

  var github = require(process.env.APP_ROOT + '/github/github.js')();

  var githubLogin = function(accessToken, callback) {
    github.login(accessToken, function(error, results) {
      if (error) { return callback(error); }
      var userData = results.user;
      history.record(userData.id, 'user', 'upsert', userData.id, [{ id: userData.id }, userData], function(error) {
        if (error) { return callback(error); }
        return callback(null, userData);
      });
    });
  };

  return {
    githubLogin: githubLogin
  };
};