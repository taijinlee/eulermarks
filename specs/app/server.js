
var should = require('should');
var request = require('request');

describe('server', function() {

  it('should return something when hitting homepage', function(done) {
    request({
      url: 'http://localhost:3000',
      method: 'get'
    }, function(error, response, body) {
      should.not.exist(error);
      done();
    });

  });

});
