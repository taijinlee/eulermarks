define([
  'jquery',
  'underscore',
  'backbone',
  'text!./logo.html'
], function($, _, Backbone, logoTemplate) {

  var LogoView = Backbone.View.extend({

    tagName: 'section',

    initialize: function(vent, pather, cookie, args) {
      this.vent = vent;
    },

    render: function() {
      this.$el.html(_.template(logoTemplate));
      return this;
    }

  });

  return LogoView;

});
