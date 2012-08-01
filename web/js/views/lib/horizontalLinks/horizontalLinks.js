define([
  'jquery',
  'underscore',
  'backbone',
  'text!./link.html'
], function($, _, Backbone, linkTemplate) {

  var HorizontalLinksView = Backbone.View.extend({
    tagName: 'ul',
    attributes: {
      'class': 'horizontalLink'
    },

    initialize: function(vent, pather, cookie, routes) {
      if (cookie.get('userId')) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }

      // shown in this order
      // [ { urlFragment: '/', name: 'Display for Link', loggedIn: true/false, id: linkId }, .. ]
      this.routes = routes;
    },

    render: function() {
      _.each(this.routes, function(route) {
        if (route.loggedIn === true && !this.loggedIn) { // only show if logged in
          return;
        } else if (route.loggedIn === false && this.loggedIn) { // only show if logged out
          return;
        }

        var li = $(this.make('li')).html(_.template(linkTemplate, route));
        this.$el.append(li);
      }, this);
      return this;
    }

  });

  return HorizontalLinksView;

});
