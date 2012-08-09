define([
  'jquery',
  'underscore',
  'backbone',
  './navigation/navigation',
  'text!./footer.html'
], function($, _, Backbone, NavigationView, footerTemplate) {

  var FooterView = Backbone.View.extend({
    tagName: 'footer',

    initialize: function(vent, pather, cookie, args) {
      this.navigation = new NavigationView(vent, pather, cookie);
    },

    render: function() {
      this.$el.html(_.template(footerTemplate));
      this.navigation.setElement(this.$('#app-footer-navigation')).render();
      return this;
    }

  });

  return FooterView;
});
