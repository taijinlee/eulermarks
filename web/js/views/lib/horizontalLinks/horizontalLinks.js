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

    initialize: function(vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;;
      // shown in this order
      // [ { symName: 'symbolicPatherName', name: 'Display for Link', loggedIn: true/false, id: linkId }, .. ]
    },

    render: function(routes) {
      var loggedIn = false;
      if (this.cookie.get('userId')) { loggedIn = true; }

      _.each(routes, function(route) {
        if (route.loggedIn === true && !loggedIn) { // only show if logged in
          return;
        } else if (route.loggedIn === false && loggedIn) { // only show if logged out
          return;
        }

        route.urlFragment = this.pather.getUrl(route.symName);
        var li = $(this.make('li')).html(_.template(linkTemplate, route));
        this.$el.append(li);
      }, this);
      return this;
    }

  });

  return HorizontalLinksView;

});
