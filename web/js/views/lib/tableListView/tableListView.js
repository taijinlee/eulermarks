define([
  'jquery',
  'underscore',
  'backbone',
  'text!./table.html'
], function($, _, Backbone, tableTemplate) {

  var View = Backbone.View.extend({
    initialize: function(config, vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function(rowKeys, data, emptyDataText) {
      // rowKeys: [{ key: key, display: displayName }, ... ]
      // data: [{ key1: value1, key2: value2 }, { key1: value1, key2: value2 }, ... ]

      this.$el.html(_.template(tableTemplate, {
        headers: _.pluck(rowKeys, 'display'),
        headerKeys: _.pluck(rowKeys, 'key'),
        emptyDataText: emptyDataText,
        data: data
      }));
      return this;
    }

  });

  return View;

});
