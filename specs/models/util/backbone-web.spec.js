
var should = require('should');
var store = require(process.env.APP_ROOT + '/store/store.js')('ram');

var requirejs = require(process.env.APP_ROOT + '/models/util/require.js');

requirejs([
  'underscore',
  'backbone-web-real',
], function(_, BackboneWebModel) {

  var TestModel = BackboneWebModel.extend({
    store: store,
    context: { database: 'test', collection: 'testBackboneServer' },
    key: { primary: 'id' },

    schema: {
      id: { type: 'string' },
      zip: { type: 'zip' },
      optionalColumn: { type: 'string', optional: true },
      defaultedColumn: { type: 'string', defaults: 'myDefault' },
      defaultedFunctionColumn : { type: 'string', defaults: function() { return 'hi!'; } }
    }
  });

  var TestModelExtend = TestModel.extend({
    schema: function() {
      var parentSchema = TestModelExtend.__super__.schema;
      return parentSchema;
    }
  });

  _.each({ testModel: TestModel, testModelExtend: TestModelExtend }, function(Model, modelName) {

    describe('backbone-web: ' + modelName, function() {

      describe('#isValid', function() {
        it('should be able to validate when all parameters are correct', function() {
          var test = new Model({ id: 'something', zip: 12345 });
          test.isValid().should.equal(true);
          test.isValid('zip').should.equal(true);
        });

        it('should be able to validate partials when a subset of parameters are correct', function() {
          var test = new Model({ zip: 12345 });
          test.isValid().should.equal(false);
          test.isValid('zip').should.equal(true);
        });

        it('should validate to false when all parameters are incorrect', function() {
          var test = new Model({ zip: 'ccc' });
          test.isValid().should.equal(false);
          test.isValid('zip').should.equal(false);
        });
      });

      describe('#isExistingFieldsValid', function() {
        it('should detect that singular fields are all correct', function() {
          var test = new Model({ id: 'something', zip: 12345 });
          test.isExistingFieldsValid().should.equal(true);
        });

        it('should detect that a singular fields is incorrect', function() {
          var test = new Model({ id: 'something', zip: 'ccc' });
          test.isExistingFieldsValid().should.equal(false);
        });
      });

      describe('#validate', function() {
        it('should be able to validate to true when all parameters are correct', function() {
          var test = new Model({ id: 'something', zip: 12345 });
          test.validate(test.toJSON()).should.equal(false);
        });

        it('should fail to validate to true when any parameter is incorrect', function() {
          var test = new Model({ zip: 12345 });
          test.validate(test.toJSON()).should.not.equal(false);
        });
      });

      describe('#checkType', function() {
        var runValidation = function(inputs) {
          for (var index = 0; index < inputs.length; ++index) {
            var error;
            if (error = BackboneWebModel.prototype.checkType(inputs[index].type, inputs[index].value)) {
              error = true; // we don't care what the error says necessarily
            }
            should.strictEqual(error, inputs[index].expectError, 'type: ' + inputs[index].type + ' value: ' + inputs[index].value);
          }
        };

        it('should handle good and bad emails', function() {
          var inputs = [
            // inputs taken from wikipedia
            // valid emails
            { type: 'email', value: 'niceandsimple@example.com', expectError: false },
            { type: 'email', value: 'simplewith+symbol@example.com', expectError: false },
            { type: 'email', value: 'a.little.unusual@example.com', expectError: false },
            { type: 'email', value: 'a.little.more.unusual@dept.example.com', expectError: false },
            { type: 'email', value: '\'@[10.10.10.10]', expectError: false },
            { type: 'email', value: '!#$%&\'*+-/=?^_`{}|~@example.org', expectError: false },

            // wikipedia says these are valid, but we are going to say it's invalid
            { type: 'email', value: 'user@[IPv6:2001:db8:1ff::a0b:dbd0]', expectError: true },
            { type: 'email', value: '"much.more unusual"@example.com', expectError: true },
            { type: 'email', value: '"very.unusual.@.unusual.com"@example.com', expectError: true },
            { type: 'email', value: '"very.(),:;<>[]".VERY."very@\\ "very".unusual"@strange.example.com', expectError: true },
            { type: 'email', value: '0@a', expectError: true },
            { type: 'email', value: '"()<>[]:;@,\\\"!#$%&\'*+-/=?^_`{}| ~  ? ^_`{}|~."@example.org', expectError: true },
            { type: 'email', value: '""@example.org', expectError: true },

            // wikipedia invalid emails
            { type: 'email', value: 'Abc.example.com', expectError: true },
            { type: 'email', value: 'Abc.@example.com', expectError: true },
            { type: 'email', value: 'Abc..123@example.com', expectError: true },
            { type: 'email', value: 'A@b@c@example.com', expectError: true },
            { type: 'email', value: 'a"b(c)d,e:f;g<h>i[j\\k]l@example.com', expectError: true },
            { type: 'email', value: 'just"not"right@example.com', expectError: true },
            { type: 'email', value: 'this is"not\\allowed@example.com', expectError: true },
            { type: 'email', value: 'this still"not\\allowed@example.com', expectError: true }
          ];

          runValidation(inputs);
        });

        it('should handle good and bad strings', function() {
          var inputs = [
            { type: 'string', value: '1', expectError: false },
            { type: 'string', value: 1, expectError: false },
            { type: 'string', value: true, expectError: true },
            { type: 'string', value: false, expectError: true },
            { type: 'string', value: 1.23, expectError: false },
            { type: 'string', value: function() { var a = 1; }, expectError: true },
            { type: 'string', value: { i: 1 }, expectError: true }
          ];

          runValidation(inputs);
        });

        it('should handle good and bad zip codes', function() {
          var inputs = [
            { type: 'zip', value: '12345', expectError: false },
            { type: 'zip', value: 12345, expectError: false },
            { type: 'zip', value: 1234, expectError: true },
            { type: 'zip', value: 123456, expectError: true },
            { type: 'zip', value: '1234', expectError: true },
            { type: 'zip', value: '123456', expectError: true },
            { type: 'zip', value: '3a843', expectError: true },
            { type: 'zip', value: '38.43', expectError: true }
          ];

          runValidation(inputs);
        });

        it('should handle good and bad integers', function() {
          var inputs = [
            { type: 'integer', value: 12345, expectError: false },
            { type: 'integer', value: '12345', expectError: false },
            { type: 'integer', value: 12345.12, expectError: true },
            { type: 'integer', value: '12345.12', expectError: true },
            { type: 'integer', value: -12345, expectError: false },
            { type: 'integer', value: '-12345', expectError: false },
            { type: 'integer', value: -12345.12, expectError: true },
            { type: 'integer', value: '-12345.12', expectError: true },
            { type: 'integer', value: 'abc', expectError: true },
            { type: 'integer', value: '', expectError: true },
            { type: 'integer', value: true, expectError: true },
            { type: 'integer', value: false, expectError: true }
          ];
        });

        it('should handle good and bad bool', function() {
          var inputs = [
            { type: 'bool', value: 0, expectError: true },
            { type: 'bool', value: '0', expectError: true },
            { type: 'bool', value: true, expectError: false },
            { type: 'bool', value: false, expectError: false },
            { type: 'bool', value: 'a', expectError: true },
            { type: 'bool', value: 'ab', expectError: true },
            { type: 'bool', value: 22, expectError: true },
            { type: 'bool', value: 22.5, expectError: true },
            // because of javascripts numeric types, otherwise i wouldn't want 1.0 to work
            { type: 'bool', value: 1.0, expectError: true },
            { type: 'bool', value: '1.', expectError: true }
          ];
          runValidation(inputs);
        });

        it('should handle good and bad timestamps', function() {
          var inputs = [
            { type: 'timestamp', value: new Date().getTime(), expectError: false },
            { type: 'timestamp', value: new Date(1029847).getTime(), expectError: false },
            { type: 'timestamp', value: new Date('1999-01-05').getTime(), expectError: false },
            { type: 'timestamp', value: new Date('1999-01-05 14:12:29').getTime(), expectError: false },
            { type: 'timestamp', value: new Date('01/05/1999').getTime(), expectError: false },
            { type: 'timestamp', value: new Date('01/05/1999 23:10:56').getTime(), expectError: false },
            { type: 'timestamp', value: new Date(2000, 2, 14).getTime(), expectError: false },

            { type: 'timestamp', value: 1029847, expectError: false },
            { type: 'timestamp', value: '1999-01-05', expectError: true },
            { type: 'timestamp', value: '1999-01-05 14:12:29', expectError: true },
            { type: 'timestamp', value: '01/05/1999', expectError: true },
            { type: 'timestamp', value: '01/05/1999 23:10:56', expectError: true },
          ];

          runValidation(inputs);
        });
      });

      describe('#getSchemaDefaults', function() {
        it('should get default columns with values as object', function() {
          var test = new Model();
          test.getSchemaDefaults().should.eql({ defaultedColumn: 'myDefault', defaultedFunctionColumn: 'hi!' });
        });
      });

      describe('#toJSON', function() {
        it('should be able to get the values from the model without defaults', function() {
          var test = new Model({ zip: 12 });
          test.toJSON({ defaults: false }).should.eql({ zip: 12 });
        });

        it('should be able to get the values from the model with defaults', function() {
          var test = new Model({ zip: 12 });
          test.toJSON().should.eql({ zip: 12, defaultedColumn: 'myDefault', defaultedFunctionColumn: 'hi!' });
        });

      });
    });
  });

});
