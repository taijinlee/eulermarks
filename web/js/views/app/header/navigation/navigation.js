define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/horizontalLinks/horizontalLinks'
], function($, _, Backbone, HorizontalLinksView) {

  var NavigationView = Backbone.View.extend({
    tagName: 'nav',
    events: {
      'click #logout': 'logout'
    },

    initialize: function(vent, pather, cookie, args) {
      this.routes = [
        { path: 'homepage', name: 'Home' },
        { path: 'githubOauth', name: 'Sign in using GitHub', loggedIn: false },
        { path: 'account', name: 'Account', loggedIn: true },
        { path: 'logout', name: 'Sign out', loggedIn: true, id: 'logout' }
      ];

      this.navigation = new HorizontalLinksView(vent, pather, cookie);
    },

    render: function() {
      this.$el.append(this.navigation.render(this.routes).$el);
      return this;
    },

    logout: function() {
      $.ajax({
        url: '/api/auth/logout',
        success: function() {
          Backbone.history.navigate('', true);
        },
        error: function() {
          Backbone.history.navigate('', true);
        }
      });
    }


  });

  return NavigationView;

});
