define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/horizontalLinks/horizontalLinks',
  'text!./header.html'
], function($, _, Backbone, HorizontalLinksView, headerTemplate) {

  var View = Backbone.View.extend({
    events: {
      'click #logout': 'logout'
    },

    initialize: function(vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
      this.routes = [
        { symName: 'githubOauth', name: 'Sign in using GitHub', loggedIn: false },
        { symName: 'logout', name: 'Sign out', loggedIn: true, id: 'logout' }
      ];

      this.navigation = new HorizontalLinksView(this.vent, this.pather, this.cookie);
    },

    render: function() {
      this.$el.html(_.template(headerTemplate));

      this.navigation.setElement(this.$('#app-header-navigation')).render(this.routes);
      return this;
    },

    logout: function() {
      var self = this;
      $.ajax({
        url: '/api/auth/logout',
        success: function() {
          Backbone.history.navigate(self.pather.getUrl('logout'), true);
        },
        error: function() {
          Backbone.history.navigate(self.pather.getUrl('logout'), true);
        }
      });
      return false;
    }


  });

  return View;

});
