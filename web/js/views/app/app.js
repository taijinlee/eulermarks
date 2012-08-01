define([
  'jquery',
  'underscore',
  'backbone',
  'views/app/header/header',
  'views/app/notifications/notifications',
  'views/app/footer/footer'
], function($, _, Backbone, HeaderView, NotificationsView, FooterView) {

  var AppView = Backbone.View.extend({

    el: $('#container'),

    initialize: function(vent, pather, cookie, args) {
      this.vent = vent;

      this.header = new HeaderView(vent, pather, cookie, args);
      this.notifications = new NotificationsView(vent, pather, cookie, args);
      this.footer = new FooterView(vent, pather, cookie, args);
    },

    render: function(view) {
      this.$el.empty();
      this.$el.append(
        this.header.render().$el.addClass('row'),
        this.notifications.render().$el.addClass('row'),
        view.render().$el.addClass('row'),
        this.footer.render().$el.addClass('row')
      );
      return this;
    },

    bindNotifications: function() {
      this.notifications.bind();
    }

  });

  return AppView;

});
