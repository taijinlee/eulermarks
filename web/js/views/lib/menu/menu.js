define([
  'jquery',
  'underscore',
  'backbone',
  'text!views/lib/menu/menu.html'
], function($, _, Backbone, menuTemplate) {

  var MenuView = Backbone.View.extend({

    tagName: 'section',
    className: 'menu',

    /**
     * Creates a menu given menu items in given order
     * [
     *   {symName: 'symName', displayName: 'displayName', args: { arg1: arg1Value, arg2: arg2Value ... }, id: myId, _class: myClass }
     *   ...
     * ]
     */
    initialize: function(vent, pather, cookie, menuItems) {
      this.pather = pather;
      this.cookie = cookie;
      this.menuItems = menuItems;
    },

    render: function() {
      var self = this;
      var menuItems = _.map(this.menuItems, function(menuItem) {
        return {
          display: menuItem.displayName,
          href: self.pather.getUrl(menuItem.symName, menuItem.args),
          id: menuItem.id,
          _class: menuItem._class
        };
      });

      this.$el.html(_.template(menuTemplate, { menuItems: menuItems }));
      return this;
    }

  });

  return MenuView;

});
