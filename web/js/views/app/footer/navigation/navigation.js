define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/horizontalLinks/horizontalLinks'
], function($, _, Backbone, HorizontalLinksView) {

  var NavigationView = Backbone.View.extend({
    tagName: 'nav',

    initialize: function(vent, pather, cookie, args) {
      var routes = [
        { urlFragment: '/', name: 'About' },
        { urlFragment: '/', name: 'Contact' }
      ];

      this.navigation = new HorizontalLinksView(vent, pather, cookie, routes);
    },

    render: function() {
      this.$el.append(this.navigation.render().$el);
      return this;
    }

  });

  return NavigationView;
});
