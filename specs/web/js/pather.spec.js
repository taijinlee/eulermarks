
var requirejs = require(process.env.APP_ROOT + '/models/util/require.js'); // this might be the wrong version...
var sinon = require('sinon');

requirejs([
  'web/js/pather'
], function(Pather) {

  var pather = new Pather([
    { urlFragment: '', viewName: 'newHome', symName: 'newHome' },
    { urlFragment: 'home', viewName: 'personHome', symName: 'personHome' },
    { urlFragment: 'person/:id', viewName: 'personSummary', symName: 'personSummary' },
    { urlFragment: 'checkin/new/:randomId', viewName: 'checkinMake', symName: 'checkinMake' },
    { urlFragment: 'checkin/:id/:name/:test', viewName: 'blah', symName: 'blah' }
  ]);

  before(function() {
    sinon.spy(pather, 'getUrl');
  });

  describe('Paths:', function() {
    it('can get a correct url', function() {
      pather.getUrl('newHome').should.equal('/');
      pather.getUrl('personHome').should.equal('/home');
      pather.getUrl('personSummary', {id: 18 }).should.equal('/person/18');
      pather.getUrl('checkinMake', {randomId: '8494abcdef'}).should.equal('/checkin/new/8494abcdef');
      pather.getUrl('blah', {id: '1a2b3c4d5e6f7890', name: 'someName', test: 'coolio'}).should.equal('/checkin/1a2b3c4d5e6f7890/someName/coolio');
    });

    it('will error when there are not enough arguments', function() {
      pather.getUrl.reset();

      try {
        pather.getUrl('blah');
      } catch (e) {}
      try {
        pather.getUrl('blah', {name: 'myName'});
      } catch (e) {}
      pather.getUrl.alwaysThrew().should.equal(true);
    });

    it('will error when it cannot find the symbol name', function() {
      pather.getUrl.reset();

      try {
        pather.getUrl('unknownSymbolName');
      } catch (e) {}
      try {
        pather.getUrl('unknownSymbolName', {randomArg: 'doesnt exist'});
      } catch (e) {}
      pather.getUrl.alwaysThrew().should.equal(true);
    });

  });

});
