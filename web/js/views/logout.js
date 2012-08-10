define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone) {

  var View = Backbone.View.extend({
    initialize: function(vent, pather, cookie) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
      // passthru
      Backbone.history.navigate('', true);
    }
  });

  return View;

});
