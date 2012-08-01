
/*
var should = require('should');

var store = require(process.env.APP_ROOT + '/store/store.js')('ram', 'localhost', 'noPort');
var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);

var userIdentification = require(process.env.APP_ROOT + '/app/internal/userIdentification.js')(store);

describe('user identification:', function() {
  var userData = { handle: 'userHandleCoolStuff8392', password: 'Ie945Apass#(@75', email: 'someone@somewhere.com' };

  before(function(done) {
    userData.id = store.generateId();
    var user = new UserModel(userData);
    user.create(done);
  });

  describe('#login', function() {
    it('should be able to log a user in', function(done) {
      userIdentification.login({ handle: 'userHandleCoolStuff8392', password: 'Ie945Apass#(@75' }, function(error, userId, token) {
        should.not.exist(error);
        userId.should.equal(userData.id);
        should.exist(token);
        done();
      });
    });

    it('should fail when user does not exist', function(done) {
      userIdentification.login({ handle: 'serNameCoolStuff8392', password: 'Ie945Apass#(@75' }, function(error, userId, token) {
        should.exist(error);
        should.not.exist(userId);
        should.not.exist(token);
        done();
      });
    });

    it('should fail when password does not match', function(done) {
      userIdentification.login({ handle: 'userHandleCoolStuff8392', password: 'Ie945Apass#(@7' }, function(error, userId, token) {
        should.exist(error);
        should.not.exist(userId);
        should.not.exist(token);
        done();
      });
    });
  });


  describe('#check', function() {
    it('should return userId on success', function(done) {
      userIdentification.login({ handle: 'userHandleCoolStuff8392', password: 'Ie945Apass#(@75' }, function(error, userId, token) {
        userIdentification.check(token).should.equal(userData.id);
        done();
      });
    });

    it('should error on tampered token', function(done) {
      userIdentification.login({ handle: 'userHandleCoolStuff8392', password: 'Ie945Apass#(@75' }, function(error, userId, token) {
        token = token.substr(0, token.length-2); // removing one char
        userIdentification.check(token).should.equal(false);
        done();
      });
    });

    it('should error on tampered token', function(done) {
      userIdentification.login({ handle: 'userHandleCoolStuff8392', password: 'Ie945Apass#(@75' }, function(error, userId, token) {
        token = token.replace(/\S*?:/, '85:');
        userIdentification.check(token).should.equal(false);
        done();
      });

    });
  });

});
*/