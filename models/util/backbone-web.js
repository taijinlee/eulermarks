
define([
  'underscore',
  'backbone',
  'async',
  'types'
], function(_, Backbone, async, types) {

  var BackboneWebmodel = Backbone.Model.extend({

    getSchema: function() {
      if (_.isFunction(this.schema)) { return this.schema(); }
      return this.schema;
    },

    isValid: function(column) {
      if (column) { return !this.checkType(this.getSchema()[column].type, this.attributes[column]); }
      return Backbone.Model.prototype.isValid.apply(this);
    },

    isExistingFieldsValid: function() {
      var isValid;
      async.detect(_.keys(this.attributes), _.bind(function(attribute, done) {
        return done(!this.isValid(attribute));
      }, this), function(result) {
        isValid = (result === undefined ? true : false);
      });
      return isValid;
    },

    validate: function(attrs) {
      if (this.getSchema() === undefined) { return false; }

      var errors = [];
      _.each(this.getSchema(), function(typeDef, column) {
        var value = attrs[column];

        // skip if empty and optional
        if (value === undefined && typeDef.optional === true) { return; }

        // use default as the column value for type checking
        if (value === undefined && _.has(typeDef, 'defaults')) {
          value = (_.isFunction(typeDef.defaults) ? typeDef.defaults() : typeDef.defaults);
        }

        // perform typecheck
        var error = this.checkType(typeDef.type, value);
        if (error) { errors.push({ error: error, column: column, value: value }); }
      }, this);

      // return an array of errors if any
      if (errors.length) {
        var error = new Error('invalid: context: ' + JSON.stringify(this.context) + ' ');
        error.message += _.map(errors, function(errorMeta) {
          return errorMeta.error.message + ': column: ' + errorMeta.column + ' value: ' + errorMeta.value;
        }).join(', ');
        return error;
      }
      return false;
    },

    checkType: function(type, value) {
      if (!types.hasOwnProperty(type)) { return new Error('Invalid data type'); }
      if (!types[type].checkType) { return false; } // no error if no checkType function

      var errors = types[type].checkType(value)._errors;
      if (errors.length) { return errors.shift(); }
      return false;
    },


    getSchemaDefaults: function() {
      var defaults = {};
      _.each(this.getSchema(), function(typeDef, column) {
        if (!_.has(typeDef, 'defaults')) { return; }
        defaults[column] = _.isFunction(typeDef.defaults) ? typeDef.defaults() : typeDef.defaults;
      });
      return defaults;
    },

    // overriding backbone defaults
    toJSON: function(options) {
      options = options || {};
      options.defaults = (options.defaults === undefined ? true : false);

      var json = Backbone.Model.prototype.toJSON.apply(this);
      var self = this;
      async.forEach(_.keys(json), function(column, done) {
        if (!self.getSchema().hasOwnProperty(column)) { delete json[column]; return; }
        if (json[column] === undefined) { json[column] = null; }
      });

      if (options.defaults) {
        json = _.extend(this.getSchemaDefaults(), json);
      }

      return json;
    },

    // overriding backbone defaults
    parse: function(resp) {
      var self = this;
      async.forEach(_.keys(resp), function(key, done) {
        if (!self.getSchema()[key]) { return done(); }
        resp[key] = self.castType(self.getSchema()[key].type, resp[key]);
        return done();
      }, function(error) {
        if (error) { /* do something? */ }
      });
      return resp;
    },

    castType: function(type, value) {
      if (!types.hasOwnProperty(type)) { return new Error('Invalid data type'); }
      return (types[type].sanitize ? types[type].sanitize(value) : value);
    }

  });

  return BackboneWebmodel;

});
