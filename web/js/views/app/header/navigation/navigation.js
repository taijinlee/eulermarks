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
      var routes = [
        { urlFragment: '/', name: 'Home' },
        { urlFragment: '/login', name: 'Login', loggedIn: false },
        { urlFragment: '/signup', name: 'Signup', loggedIn: false },
        { urlFragment: '/account', name: 'Account', loggedIn: true },
        { urlFragment: '/logout', name: 'Sign out', loggedIn: true, id: 'logout' }
      ];

      this.navigation = new HorizontalLinksView(vent, pather, cookie, routes);
    },

    render: function() {
      this.$el.append(this.navigation.render().$el);
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
