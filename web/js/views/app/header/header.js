define([
  'jquery',
  'underscore',
  'backbone',
  './logo/logo',
  './navigation/navigation'
], function($, _, Backbone, LogoView, NavigationView) {

  var HeaderView = Backbone.View.extend({
    tagName: 'header',
    attributes: { id: 'header' },

    initialize: function(vent, pather, cookie, args) {
      this.logo = new LogoView(vent, pather, cookie, args);
      this.navigation = new NavigationView(vent, pather, cookie, args);
    },

    render: function(options) {
      this.$el.append(this.logo.render().$el.addClass('span4'));
      this.$el.append(this.navigation.render().$el.addClass('span6 offset2'));
      return this;
    }

  });

  return HeaderView;

});
