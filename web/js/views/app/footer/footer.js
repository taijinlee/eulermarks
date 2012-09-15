define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/horizontalLinks/horizontalLinks',
  'text!./footer.html'
], function($, _, Backbone, HorizontalLinksView, footerTemplate) {

  var FooterView = Backbone.View.extend({
    tagName: 'footer',

    initialize: function(config, vent, pather, cookie, args) {
      this.routes = [
        { symName: 'homepage', name: 'About' },
        { symName: 'homepage', name: 'Contact' }
      ];

      this.navigation = new HorizontalLinksView(config, vent, pather, cookie);
    },

    render: function() {
      this.$el.html(_.template(footerTemplate));

      this.navigation.setElement(this.$('#app-footer-navigation')).render(this.routes);
      return this;
    }

  });

  return FooterView;
});
