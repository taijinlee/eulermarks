define([
  'jquery',
  'underscore',
  'backbone',
  'text!./copyright.html'
], function($, _, Backbone, copyrightTemplate) {

  var CopyrightView = Backbone.View.extend({
    tagName: 'small',

    initialize: function(vent, pather, cookie, args) {
    },

    render: function() {
      this.$el.html(_.template(copyrightTemplate));
      return this;
    }

  });

  return CopyrightView;
});
