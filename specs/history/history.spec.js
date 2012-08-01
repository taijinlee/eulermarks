
var store = require(process.env.APP_ROOT + '/store/store.js')('ram');
var history = require(process.env.APP_ROOT + '/history/history.js')(store);

describe('History:', function() {

  var historyContext = { database: 'logs', collection: 'history' };

  var userId = 'myUserId';
  var subject = 'mySubject';
  var event = 'myEvent';
  var entityId = 'someEntityId';

  beforeEach(function(done) {
    store.destroy({}, historyContext, done);
  });

  it('record should put what we expect into store', function(done) {
    history.record(userId, subject, event, entityId, [], function() {
      store.retrieve({}, historyContext, {}, function(error, data) {
        data.userId.should.equal(userId);
        data.subject.should.equal(subject);
        data.event.should.equal(event);
        data.entityId.should.equal(entityId);
        data.params.should.eql([]);
        done();
      });
    });
  });

  it('record should put what we expect into store with 1 param', function(done) {
    history.record(userId, subject, event, entityId, ['myparam1'], function() {
      store.retrieve({}, historyContext, {}, function(error, data) {
        data.userId.should.equal(userId);
        data.subject.should.equal(subject);
        data.event.should.equal(event);
        data.entityId.should.equal(entityId);
        data.params.should.eql(['myparam1']);
        done();
      });
    });
  });

  it('record should put what we expect into store with 2 params', function(done) {
    history.record(userId, subject, event, entityId, ['myparam1', 'myparam2'], function() {
      store.retrieve({}, historyContext, {}, function(error, data) {
        data.userId.should.equal(userId);
        data.subject.should.equal(subject);
        data.event.should.equal(event);
        data.entityId.should.equal(entityId);
        data.params.should.eql(['myparam1', 'myparam2']);
        done();
      });
    });
  });

  it('record should put what we expect into store with 3 params, one of which is weird', function(done) {
    history.record(userId, subject, event, entityId, ['myparam1', 'myparam2', '~!@#$%^&*()`1234567890-=_+;\'";:[]{},.<>/?'], function() {
      store.retrieve({}, historyContext, {}, function(error, data) {
        data.userId.should.equal(userId);
        data.subject.should.equal(subject);
        data.event.should.equal(event);
        data.entityId.should.equal(entityId);
        data.params.should.eql(['myparam1', 'myparam2', '~!@#$%^&*()`1234567890-=_+;\'";:[]{},.<>/?']);
        done();
      });
    });
  });


});
