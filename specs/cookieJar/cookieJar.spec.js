
var should = require('should');
var cookieJar = require(process.env.APP_ROOT + '/cookieJar/cookieJar.js')();

describe('Cookie Jar:', function() {

  var initialCookie;
  beforeEach(function() {
    initialCookie = {
      integer: 1583,
      bool: true,
      string: 'false',
      coolness: false,
      decimal: 94839.1,
      aString: '~!@#$%^&*()`1234567890-=_+[]{}\\|;\':",./<>?'
    };
  });

  it('should be able to initialize with a correct cookie', function() {
    cookieJar.init({ c: JSON.stringify(initialCookie) });
    JSON.parse(cookieJar.cookie()[1]).should.eql(initialCookie);
  });

  it('should be able to set and get cookie values', function() {
    cookieJar.init({ c: JSON.stringify(initialCookie) });
    cookieJar.get('integer').should.equal(1583);
    cookieJar.set('integer', 2000);
    cookieJar.get('integer').should.equal(2000);

    cookieJar.get('bool').should.equal(true);
    cookieJar.set('bool', false);
    cookieJar.get('bool').should.equal(false);

    cookieJar.get('string').should.equal('false');
    cookieJar.set('string', 'true');
    cookieJar.get('string').should.equal('true');

    cookieJar.get('decimal').should.equal(94839.1);
    cookieJar.set('decimal', 857.48573);
    cookieJar.get('decimal').should.equal(857.48573);
  });

  it('should be able to delete a cookie value', function() {
    cookieJar.init({ c: JSON.stringify(initialCookie) });

    cookieJar.get('integer').should.equal(1583);
    cookieJar.del('integer');
    should.not.exist(cookieJar.get('integer'));

    cookieJar.get('bool').should.equal(true);
    cookieJar.del('bool');
    should.not.exist(cookieJar.get('bool'));

    cookieJar.get('string').should.equal('false');
    cookieJar.del('string');
    should.not.exist(cookieJar.get('string'));

    cookieJar.get('decimal').should.equal(94839.1);
    cookieJar.del('decimal');
    should.not.exist(cookieJar.get('decimal'));
  });

});
