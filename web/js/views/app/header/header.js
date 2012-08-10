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
      this.routes = [
        { symName: 'githubOauth', name: 'Sign in using GitHub', loggedIn: false },
        { symName: 'logout', name: 'Sign out', loggedIn: true, id: 'logout' }
      ];

      this.navigation = new HorizontalLinksView(vent, pather, cookie);
    },

    render: function(options) {
      this.$el.html(_.template(headerTemplate));
      this.navigation.setElement(this.$('#app-header-navigation')).render(this.routes);
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
