
module.exports = function(store, history) {
  var crypto = require('crypto');
  var async = require('async');
  var _ = require('underscore');

  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var WebUserModel = require(process.env.APP_ROOT + '/models/webModel.js')(store, 'user');

  var assetManager = require(process.env.APP_ROOT + '/assetManager/assetManager.js')(store);
  var tokenizer = require(process.env.APP_ROOT + '/tokenizer/tokenizer.js')();

  /* Basic crud */
  var create = function(userData, callback) {
    userData.id = store.generateId();
    var user = new UserModel(userData);
    if (!user.isValid()) { return callback(new Error('Invalid')); }

    async.auto({
      salt: function(done) {
        var salt = tokenizer.generateSalt();
        if (!salt) { return done(new Error('invalid: salt generated improperly: ' + salt)); }
        return done(null, salt);
      },
      history: ['salt', function(done, results) {
        user.set({
          salt: results.salt,
          password: tokenizer.generate(results.salt, user.get('password'), 0, 0)
        });

        history.record(userData.id, 'user', 'create', userData.id, [user.toJSON()], done);
      }]
    }, function(error, results) {
      if (error) { return callback(error); }
      var webUser = new WebUserModel(user.toJSON()).toJSON();
      delete webUser.password; // slight hack
      return callback(null, webUser);
    });
  };

  var retrieve = function(tokenUserId, userId, callback) {
    var isSelf = tokenUserId === userId;
    var user = new UserModel({ id: userId });
    if (!user.isExistingFieldsValid()) { return callback(new Error('invalid')); }

    user.retrieve(function(error, data) {
      if (error) { return callback(error); }
      data.isSelf = isSelf;
      assetManager.getUrl(data.imageAssetId, function(error, url) {
        if (error && error.message !== 'notFound') { return callback(error); }
        data.profilePictureUrl = (error) ? '' : url;
        return callback(null, data);
      });
    });
  };

  var update = function(tokenUserId, userId, updateData, callback) {
    if (tokenUserId !== userId) { return callback(new Error('unauthorized')); }

    var user = new UserModel(_.extend({ id: userId }, updateData), { parse: true });
    if (!user.isExistingFieldsValid()) { return callback(new Error('invalid')); }

    history.record(tokenUserId, 'user', 'update', userId, [{ id: userId }, updateData], callback);
  };

  var destroy = function(tokenUserId, userId, callback) {
    if (tokenUserId !== userId) { return callback(new Error('unauthorized')); }

    var user = new UserModel({ id: userId });
    if (!user.isExistingFieldsValid()) { return callback(new Error('invalid')); }

    history.record(tokenUserId, 'user', 'remove', userId, [userId], callback);
  };

  return {
    create: create,
    retrieve: retrieve,
    update: update,
    destroy: destroy
  };

};
