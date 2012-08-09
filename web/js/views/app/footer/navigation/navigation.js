define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/horizontalLinks/horizontalLinks'
], function($, _, Backbone, HorizontalLinksView) {

  var View = Backbone.View.extend({
    initialize: function(vent, pather, cookie, args) {
      this.routes = [
        { symName: 'homepage', name: 'About' },
        { symName: 'homepage', name: 'Contact' }
      ];

      this.navigation = new HorizontalLinksView(vent, pather, cookie);
    },

    render: function() {
      this.$el.html(this.navigation.render(this.routes).$el);
      return this;
    }

  });

  return View;
});
