
var sinon = require('sinon');

var datastore = 'ram';
var store = require(process.env.APP_ROOT + '/store/store.js')(datastore, 'localhost', 27017);
var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);

describe('User Server Model:', function() {

  /**
   * this is probably extraneous -- should live in model validation code
   **/
  describe('#validate', function() {
    describe('#email', function() {
      it('cannot be set with bad email', function() {
        var user = new UserModel();
        var eventSpy = sinon.spy();
        user.bind('error', eventSpy);
        sinon.spy(user, 'set');

        try {
          user.set({ email: 'bademail' });
        } catch (e) {}

        try {
          user.set({ email: 'bademail@' });
        } catch (e) {}

        try {
          user.set({ email: 'bademail@gmail.' });
        } catch (e) {}

        user.set.exceptions.length.should.equal(3);
      });
        
    });
  });
});
