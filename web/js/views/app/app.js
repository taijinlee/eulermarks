define([
  'jquery',
  'underscore',
  'backbone',
  'views/app/header/header',
  'views/app/notifications/notifications',
  'views/app/footer/footer'
], function($, _, Backbone, HeaderView, NotificationsView, FooterView) {

  var View = Backbone.View.extend({
    el: $('#container'),

    initialize: function(vent, pather, cookie) {
      this.vent = vent;

      this.header = new HeaderView(vent, pather, cookie);
      // this.notifications = new NotificationsView(vent, pather, cookie, args);
      this.footer = new FooterView(vent, pather, cookie);
    },

    render: function(view) {
      this.header.setElement(this.$('#app-header')).render();
      // this.notifications.setElement(this.$('#app-notifications')).render();
      view.setElement(this.$('#app-body')).render();
      this.footer.setElement(this.$('#app-footer')).render();
      return this;
    },

    bindNotifications: function() {
      this.notifications.bind();
    }
  });

  return View;

});
