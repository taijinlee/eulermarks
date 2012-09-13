
module.exports = function(store, history) {
  var async = require('async');
  var _ = require('underscore');

  var RepoFileModel = require(process.env.APP_ROOT + '/models/repoFile.js')(store);

  var list = function(filters, limit, skip, callback) {
    RepoFileModel.prototype.list(filters, limit, skip, function(error, repoFiles) {
      if (error) { return callback(error); }
      return callback(null, repoFiles);
    });
  };

  return {
    list: list
  };

};