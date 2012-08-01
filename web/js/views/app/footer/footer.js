define([
  'jquery',
  'underscore',
  'backbone',
  './navigation/navigation',
  './copyright/copyright'
], function($, _, Backbone, NavigationView, CopyrightView) {

  var FooterView = Backbone.View.extend({
    tagName: 'footer',

    initialize: function(vent, pather, cookie, args) {
      this.navigation = new NavigationView(vent, pather, cookie, args);
      this.copyright = new CopyrightView(vent, pather, cookie, args);
    },

    render: function() {
      this.$el.append(this.make('hr', { 'class': 'span10 offset1' }));
      this.$el.append(this.navigation.render().$el.addClass('span12'));
      this.$el.append(this.copyright.render().$el.addClass('span12'));
      return this;
    }

  });

  return FooterView;
});
