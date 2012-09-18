
define([
  'underscore',
  'backbone-web-real'
], function(_, BackboneWebModel) {

  var cache = require.nodeRequire(process.env.APP_ROOT + '/cache/cache.js')();

  var BackboneServerModel = BackboneWebModel.extend({

    create: function(callback) {
      var self = this;

      // populate defaults when storing into store
      this.store.insert(_.extend({}, this.getSchemaDefaults(), this.toJSON()), this.context, function(error, data) {
        if (!callback) { return; }
        if (error) { return callback(error); }
        var success = self.set(data, {
          error: function(model, error) {
            return callback(error);
          }
        });
        if (!success) { return; } // error case taken care by error callback

        return callback(null, data);
      });
    },

    retrieve: function(callback) {
      var self = this;
      var params = { criteria: this.toJSON({ defaults: false }), context: this.context, options: {} };

      cache.get(params, function(error, cachedValue) {
        if (cachedValue !== null) { return callback(null, cachedValue); }

        self.store.retrieve(params.criteria, params.context, params.options, function(error, item) {
          if (error) { return callback(error); }
          if (!item) { return cache.set(params, false, callback); }
          // populate defaults when retrieving from store
          var parsedItem = self.parse(_.extend({}, self.getSchemaDefaults(), item));

          var success = self.set(parsedItem, {
            error: function(model, error) {
              return callback(error);
            }
          });
          if (!success) { return; } // error case taken care by error callback
          return cache.set(params, self.toJSON(), callback);
        });
      });

    },

    update: function(criteria, callback) {
      this.store.update(criteria, this.toJSON({ defaults: false }), this.context, function(error) {
        if (!callback) { return; }
        if (error) { return callback(error); }
        return callback(null);
      });
    },

    upsert: function(criteria, callback) {
      this.store.upsert(criteria, this.toJSON({ defaults: false }), this.context, function(error) {
        if (!callback) { return; }
        if (error) { return callback(error); }
        return callback(null);
      });
    },

    remove: function(callback) {
      this.store.destroy(this.toJSON({ defaults: false }), this.context, function(error) {
        if (!callback) { return; }
        if (error) { return callback(error); }
        return callback(null);
      });
    },

    list: function(criteria, limit, skip, callback) {
      var self = this;
      var params = { criteria: criteria, context: this.context, options: { limit: limit, skip: skip, hint: null, raw: false, slaveOk: false } };

      cache.get(params, function(error, cachedValue) {
        if (cachedValue !== null) { return callback(null, cachedValue); }

        self.store.query(params.criteria, params.context, params.options, function(error, items) {
          if (error) { return callback(error); }
          return cache.set(params, items, callback);
        });
      });
    }

  });

  return BackboneServerModel;

});
