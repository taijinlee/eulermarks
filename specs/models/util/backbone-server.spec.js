
var sinon = require('sinon');
var should = require('should');

var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

var store = require(process.env.APP_ROOT + '/store/store.js')('ram', 'localhost', 20717, 'main');

requirejs([
  'backbone-web'
], function(BackboneServerModel) {

  describe('Backbone server models', function() {

    var TestModel = BackboneServerModel.extend({
      store: store,
      context: { database: 'test', collection: 'testBackboneServer' },
      key: { primary: 'id' },

      schema: {
        id: { type: 'string' },
        optionalColumn: { type: 'string', optional: true },
        defaultedColumn: { type: 'string', defaults: 'myDefault' },
      }
    });

    beforeEach(function(done) {
      // delete all contenst of store's db before every test
      store.destroy({}, TestModel.prototype.context, done);
    });

    /**
     * Unit tests for create
     */
    describe('#create', function() {
      it('should be able to create an object', function(done) {
        var testData = { id: store.generateId() };

        var test = new TestModel(testData);
        test.create(function(error) {
          should.not.exist(error);

          store.retrieve({ id: testData.id }, test.context, {}, function(error, storedData) {
            storedData.id.should.equal(testData.id);
            should.not.exist(storedData.optionalColumn);
            storedData.defaultedColumn.should.equal(test.schema.defaultedColumn.defaults);
            done();
          });
        });
      });

      it('should be able to create an object with an optional field', function(done) {
        var testData = { id: store.generateId(), optionalColumn: 'optionalValue' };
        var test = new TestModel(testData);
        test.create(function(error) {
          should.not.exist(error);

          store.retrieve({ id: testData.id }, test.context, {}, function(error, storedData) {
            storedData.id.should.equal(testData.id);
            storedData.optionalColumn.should.equal(testData.optionalColumn);
            storedData.defaultedColumn.should.equal(test.schema.defaultedColumn.defaults);
            done();
          });
        });
      });

      it('should be able to create an object overriding default value', function(done) {
        var testData = { id: store.generateId(), defaultedColumn: 'nonDefaultValue' };
        var test = new TestModel(testData);
        test.create(function(error) {
          should.not.exist(error);

          store.retrieve({ id: testData.id }, test.context, {}, function(error, storedData) {
            storedData.id.should.equal(testData.id);
            should.not.exist(storedData.optionalColumn);
            storedData.defaultedColumn.should.equal(testData.defaultedColumn);
            done();
          });
        });
      });

      it('should should ignore values outside of schema', function(done) {
        var testData = { id: store.generateId(), notInSchema: 'what?', notInSchema2: 'what? second' };
        var test = new TestModel(testData);
        test.create(function(error) {
          should.not.exist(error);

          store.retrieve({ id: testData.id }, test.context, {}, function(error, storedData) {
            storedData.id.should.equal(testData.id);
            should.not.exist(storedData.notInSchema);
            should.not.exist(storedData.notInSchema2);
            done();
          });
        });
      });
    });


    /**
     * Unit tests for retrieve
     */
    describe('#retrieve', function() {
      it('should be able to retrieve an object with defaults', function(done) {
        var testData = { id: store.generateId() };
        var test = new TestModel(testData);
        store.insert(testData, test.context, function() {
          test.retrieve(function(error, data) {
            should.not.exist(error);

            data.id.should.equal(testData.id);
            should.not.exist(data.optionalColumn);
            data.defaultedColumn.should.equal(TestModel.prototype.schema.defaultedColumn.defaults);
            done();
          });
        });
      });

      it('should be able to retrieve an object with overriden defaults', function(done) {
        var testData = { id: store.generateId(), defaultedColumn: 'nonDefaultValue' };
        var test = new TestModel(testData.id);
        store.insert(testData, test.context, function() {
          test.retrieve(function(error, data) {
            should.not.exist(error);

            data.id.should.equal(testData.id);
            should.not.exist(data.optionalColumn);
            data.defaultedColumn.should.equal(testData.defaultedColumn);
            done();
          });
        });
      });

      it('should be able to retrieve an object with optional column filled in', function(done) {
        var testData = { id: store.generateId(), optionalColumn: 'myOptionalValue' };
        var test = new TestModel(testData);
        store.insert(testData, test.context, function() {
          test.retrieve(function(error, data) {
            should.not.exist(error);

            data.id.should.equal(testData.id);
            data.optionalColumn.should.equal(testData.optionalColumn);
            data.defaultedColumn.should.equal(TestModel.prototype.schema.defaultedColumn.defaults);
            done();
          });
        });
      });

      it('should remove extraneous columns when attempting to retrieve', function(done) {
        var testData = { id: store.generateId(), notInSchema: 'random stuff here' };
        var test = new TestModel(testData);
        store.insert(testData, test.context, function() {
          test.retrieve(function(error, data) {
            should.not.exist(error);

            data.id.should.equal(testData.id);
            should.not.exist(data.optionalColumn);
            data.defaultedColumn.should.equal(TestModel.prototype.schema.defaultedColumn.defaults);
            done();
          });
        });
      });

      it('should not error when it does not find anything', function(done) {
        var testData = { id: store.generateId(), optionalColumn: 'myOptionalValue' };
        var test = new TestModel(testData);
        test.retrieve(function(error, data) {
          should.not.exist(error);

          data.should.equal(false);
          done();
        });
      });

    });

    /**
     * Unit tests for update
     */
    describe('#update', function() {
      it('should be able to update an object', function(done) {
        var testData = { id: store.generateId() };
        store.insert(testData, TestModel.prototype.context, function() {
          testData.optionalColumn = 'myOptionalValue';
          testData.defaultedColumn = 'nonDefaultValue';

          var test = new TestModel(testData);
          test.update({ id: testData.id }, function(error) {
            should.not.exist(error);

            store.retrieve({ id: testData.id }, TestModel.prototype.context, {}, function(error, data) {
              data.optionalColumn.should.equal(testData.optionalColumn);
              data.defaultedColumn.should.equal(testData.defaultedColumn);
              done();
            });
          });
        });
      });

      it('should not insert default values automatically', function(done) {
        var testData = { id: store.generateId() };
        store.insert(testData, TestModel.prototype.context, function() {

          var test = new TestModel(testData);
          test.update({ id: testData.id }, function(error) {
            should.not.exist(error);

            store.retrieve({ id: testData.id }, TestModel.prototype.context, {}, function(error, data) {
              should.not.exist(data.defaultedColumn);
              done();
            });
          });
        });
      });
    });

    /**
     * Unit tests for remove
     */
    describe('#remove', function() {
      it('should be able to remove elements', function(done) {
        var testData = { id: store.generateId() };
        store.insert(testData, TestModel.prototype.context, function() {

          var test = new TestModel(testData);
          test.remove(function(error) {
            should.not.exist(error);

            store.retrieve({ id: testData.id }, TestModel.prototype.context, {}, function(error, data) {
              should.not.exist(error);
              should.not.exist(data);
              done();
            });
          });
        });
      });
    });

  });


});
