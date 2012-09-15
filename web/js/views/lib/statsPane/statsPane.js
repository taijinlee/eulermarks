define([
  'jquery',
  'underscore',
  'backbone',
  'text!./stat.html'
], function($, _, Backbone, statTemplate) {

  var View = Backbone.View.extend({
    tagName: 'dl',
    attributes: {
      'class': 'statsPane'
    },

    initialize: function(config, vent, pather, cookie, args) {
    },

    render: function(stats) {
      /**
       * stats in format
       * [ {key: key, value: value}, ... ] from top downwards
       */
      _.each(stats, function(stat) {
        this.$el.append(_.template(statTemplate, stat));
      }, this);
      return this;
    }

  });
  return View;

});
