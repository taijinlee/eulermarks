
var sinon = require('sinon');
var should = require('should');
var _ = require('underscore');

var datastores = [
  { type: 'ram', host: 'none', port: 'none' },
  { type: 'mongo', host: 'localhost', port: 27017 }
];

var stores = {};

var doTest = function(store) {

    describe('store:', function() {
      var context = { database: 'test', collection: 'test' };

      var data = {
        id: store.generateId(),
        test: 'myTestObject'
      };
      var update = { test: 'myNewTestObject', blah: 'cool' };


      beforeEach(function(done) {
        // delete everything first
        store.destroy({}, context, function(error) {
          // insert the assumed stored data
          store.insert(data, context, done);
        });
      });


      describe('#insert', function() {
        it('should be able to create an object and immediately fetch it', function(done) {

          var _data = _.clone(data);
          _data.id = store.generateId();

          store.insert(_data, context, function(error) {
            should.not.exist(error);

            store.retrieve(_data, context, {}, /* options */ function(error, storedData) {
              should.not.exist(error);
              storedData.should.eql(_data);
              done();
            });
          });
        });

        it('should error on duplicate id key insert', function(done) {
          store.insert(data, context, function(error) {
            should.exist(error);
            done();
          });
        });
      });

      describe('#update', function() {
        it('should be able to update an object', function(done) {
          store.update({ id: data.id }, update, context, function(error) {
            should.not.exist(error);
            store.retrieve({ id: data.id }, context, {}, /* options */ function(error, storedData) {
              storedData.should.eql(_.extend(data, update));
              done();
            });
          });
        });
      });

      describe('#upsert', function() {
        it('should be able to update an object', function(done) {
          store.upsert({ id: data.id }, update, context, function(error) {
            should.not.exist(error);
            store.retrieve({ id: data.id }, context, {}, /* options */ function(error, storedData) {
              storedData.should.eql(_.extend(data, update));
              done();
            });
          });
        });

        it('should be able to insert an object', function(done) {
          var newId = store.generateId();
          store.upsert({ id: newId }, update, context, function(error) {
            should.not.exist(error);
            store.retrieve({ id: newId }, context, {}, /* options */ function(error, storedData) {
              storedData.should.eql(_.extend(data, update, {id: newId }));
              done();
            });
          });
        });
      });


      describe('#delete', function() {
        it('should be able to delete an object', function(done) {
          store.retrieve({ id: data.id }, context, {} /* options */, function(error, storedData) {
            should.not.exist(error);
            storedData.should.eql(data);

            store.destroy({ id: data.id }, context, function(error) {
              should.not.exist(error);
              store.retrieve({ id: data.id }, context, {} /* options */, function(error, storedData) {
                should.not.exist(error);
                should.not.exist(storedData);
                done();
              });
            });

          });
        });
      });

    });
};


for (var datastoreIndex in datastores) {
  var datastore = datastores[datastoreIndex];
  stores[datastore.type] = require(process.env.APP_ROOT + '/store/store.js')(datastore.type, datastore.host, datastore.port);

  doTest(stores[datastore.type]);
}
