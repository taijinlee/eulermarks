define([
  'jquery',
  'underscore',
  'backbone',
  'text!views/homepage/homepage.html'
], function($, _, Backbone, homepageTemplate) {

  var View = Backbone.View.extend({
    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.html('Homepage!');
      return this;
    }

  });

  return View;

});