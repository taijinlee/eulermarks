
var tokenizer = require(process.env.APP_ROOT + '/tokenizer/tokenizer.js')();

describe('Tokenizer:', function() {
  var tokenize = '73#4$jsu%x9&2k(1h@xoq_;1"jdo2';
  var salt = '73x-1{}|-8d0c /.,>{<P';

  it('should generate and match token on indefinite basis', function(done) {
    var now = new Date().getTime();
    var token = tokenizer.generate(tokenize, salt, now, 0);
    setTimeout(function() {
      tokenizer.match(tokenize, salt, now, 0, token).should.equal(true);
      done();
    }, 25);
  });

  it('should generate and match token based on time', function(done) {
    var now = new Date().getTime();
    var token = tokenizer.generate(tokenize, salt, now, 10);
    tokenizer.match(tokenize, salt, now, 10, token).should.equal(true);

    setTimeout(function() {
      tokenizer.match(tokenize, salt, now, 10, token).should.equal(false);
      done();
    }, 15);
  });

});
