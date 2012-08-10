define([
  'jquery',
  'underscore',
  'backbone',
  'text!./link.html'
], function($, _, Backbone, linkTemplate) {

  var View = Backbone.View.extend({
    initialize: function(vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
      // shown in this order
      // [ { symName: 'symbolicPatherName', name: 'Display for Link', loggedIn: true/false, id: linkId }, .. ]
    },

    render: function(routes) {
      var loggedIn = false;
      if (this.cookie.get('userId')) { loggedIn = true; }

      var $ul = $(this.make('ul', { 'class': 'horizontalLink' }));
      _.each(routes, function(route) {
        if (route.loggedIn === true && !loggedIn) { // only show if logged in
          return;
        } else if (route.loggedIn === false && loggedIn) { // only show if logged out
          return;
        }

        route.urlFragment = this.pather.getUrl(route.symName);
        $ul.append(_.template(linkTemplate, route));
      }, this);

      this.$el.append($ul);
      return this;
    }

  });

  return View;

});
