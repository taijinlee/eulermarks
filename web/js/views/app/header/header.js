define([
  'jquery',
  'underscore',
  'backbone',
  './navigation/navigation',
  'text!./header.html'
], function($, _, Backbone, NavigationView, headerTemplate) {

  var View = Backbone.View.extend({
    initialize: function(vent, pather, cookie, args) {
      this.navigation = new NavigationView(vent, pather, cookie, args);
    },

    render: function(options) {
      this.$el.html(_.template(headerTemplate));
      this.navigation.setElement(this.$('#app-header-navigation')).render();
      return this;
    }

  });

  return View;

});
