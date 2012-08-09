define([
  'jquery',
  'underscore',
  'backbone',
  'views/lib/horizontalLinks/horizontalLinks'
], function($, _, Backbone, HorizontalLinksView) {

  var View = Backbone.View.extend({
    events: {
      'click #logout': 'logout'
    },

    initialize: function(vent, pather, cookie, args) {
      this.routes = [
        { symName: 'githubOauth', name: 'Sign in using GitHub', loggedIn: false },
        { symName: 'logout', name: 'Sign out', loggedIn: true, id: 'logout' }
      ];

      this.navigation = new HorizontalLinksView(vent, pather, cookie);
    },

    render: function() {
      this.$el.html(this.navigation.render(this.routes).$el);
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
      return false;
    }


  });

  return View;

});
