
var requirejs = require(process.env.APP_ROOT + '/models/util/require.js'); // this might be the wrong version...

requirejs([
  'web/js/models/user'
], function(UserModel) {

  describe('User Model:', function() {
    it('Can be created with default values for its attributes.', function(done) {

      var user = new UserModel();
      // user.get('handle').should.equal('');
      setTimeout(done, 50);
    });
  });

});
