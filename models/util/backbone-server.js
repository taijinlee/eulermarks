
define([
  'underscore',
  'backbone-web-real'
], function(_, BackboneWebModel) {

  var BackboneServerModel = BackboneWebModel.extend({

    create: function(callback) {
      var self = this;

      // populate defaults when storing into store
      this.store.insert(_.extend({}, this.getSchemaDefaults(), this.toJSON()), this.context, function(error, data) {
        if (error) { return callback(error); }
        var success = self.set(data, {
          error: function(model, error) {
            return callback(error);
          }
        });
        if (!success) { return; } // error case taken care by error callback

        return (callback) ? callback(null, data) : null;
      });
    },

    retrieve: function(callback) {
      var self = this;
      this.store.retrieve(this.toJSON({ defaults: false }), this.context, {}, function(error, item) {
        if (error) { return callback(error); }
        if (!item) { return callback(null, false); }

        // populate defaults when retrieving from store
        var parsedItem = self.parse(_.extend({}, self.getSchemaDefaults(), item));

        var success = self.set(parsedItem, {
          error: function(model, error) {
            return callback(error);
          }
        });
        if (!success) { return; } // error case taken care by error callback

        return callback(null, self.toJSON());
      });
    },

    update: function(criteria, callback) {
      this.store.update(criteria, this.toJSON({ defaults: false }), this.context, function(error) {
        if (error) { return callback(error); }
        return callback(null);
      });
    },

    upsert: function(criteria, callback) {
      this.store.upsert(criteria, this.toJSON({ defaults: false }), this.context, function(error) {
        if (error) { return callback(error); }
        return callback(null);
      });
    },

    remove: function(callback) {
      this.store.destroy(this.toJSON({ defaults: false }), this.context, function(error) {
        if (error) { return callback(error); }
        return callback(null);
      });
    },

    list: function(criteria, limit, skip, callback) {
      this.store.query(criteria, this.context, {limit: limit, skip: skip }, function(error, items) {
        if (error) { return callback(error); }
        return callback(null, items);
      });
    }

  });

  return BackboneServerModel;

});
