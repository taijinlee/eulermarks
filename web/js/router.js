define([
  'jquery',
  'underscore',
  'backbone',
  'pather',
  'models/cookie',
  'views/app/app'
], function($, _, Backbone, Pather, CookieModel, AppView) {
  var Router = Backbone.Router.extend({

    paths: [
      { urlFragment: '', view: 'homepage', symName: 'homepage' },
      { urlFragment: 'account', view: 'account/account', symName: 'account', requireLogin: true },
      { urlFragment: 'logout', view: '', symName: 'logout' },
      { urlFragment: 'https://github.com/login/oauth/authorize?client_id=232bd07a87e144588ce1', view: '!external', symName: 'githubOauth' }
    ],

    initialize: function(vent) {
      this.vent = vent;
      this.pather = new Pather(this.paths);
      this.cookie = null;

      // going backwards for backbone compatability
      var self = this;
      _.each(this.paths.reverse(), function(path) {
        var view = path.view;
        // ignore any empty views or views with ! in the view name
        if (!view || view.indexOf('!') !== -1) { return; }

        self.route(path.urlFragment, view, (function() {
          var _view = view;
          var requireLogin = path.requireLogin || false;
          return function() {
            var regex = (document.cookie.search(';') === -1) ? /c=(.*)/ : /c=(.*?);/;
            var cookieJSON = document.cookie ? $.parseJSON(decodeURIComponent(regex.exec(document.cookie)[1])) : {};
            self.cookie = new CookieModel(cookieJSON);

            // boot back to homepage if we require a login, and we don't have one
            if (requireLogin && (!self.cookie || !self.cookie.get('userId'))) {
              return Backbone.history.navigate('', true);
            }

            var args = Array().slice.call(arguments);
            args.unshift(_view);
            self.genericRoute.apply(self, args);
          };
        }()));
      });

      Backbone.history.start({ pushState: true });
    },

    genericRoute: function() {
      var args = Array().slice.call(arguments);
      var view = args.shift();
      var self = this;
      var app = new AppView(self.vent, self.pather, self.cookie, args);

      require([
        'views/' + view
      ], function(View) {
        $(window).unbind();

        self.vent.unbind();
        // self.AppView.bindNotifications();
        app.render(new View(self.vent, self.pather, self.cookie, args));
      });
    },

    defaultAction: function(actions) {
      console.log('No Route:', actions);
    }

  });

  return Router;

});
