
// assume server is up
var should = require('should');
var request = require('request');

describe('user apis:', function() {

  it('create', function(done) {
    request({
      url: 'http://localhost:3000',
      method: 'post',
      body: 'handle=test&password=test&'
    }, function(error, response, body) {
      
      done();
    });

  });

});
