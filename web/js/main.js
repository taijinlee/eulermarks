
require.config({
  paths: {
    'backbone': 'lib/backbone/backbone-amd',
    'backbone-web': 'lib/backbone/backbone-web',
    'types': 'lib/backbone/types',
    'validator': 'lib/validator/validator-min',
    'jquery': 'lib/jquery/jquery-min',
    'underscore': 'lib/underscore/underscore',
    'async': 'lib/async/async',
    'json2': 'lib/json2',
    'text': 'lib/require/text',
    'order': 'lib/require/order-min',
    'humanize': 'lib/humanize'
  },
  baseUrl: '/js',
  priority: ['common']
});

require([
  'jquery',
  'underscore',
  'backbone',
  'router'
], function($, _, Backbone, Router) {
  var vent = _.extend({}, Backbone.Events);
  var router = new Router(vent);

  // set a globally delegated event for a tags.
  // when clicked, we'll use backbone navigate unless ctrl, meta key were held, or if it was not left click
  $('body').on('click', 'a', function(event) {
    if (event.which === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      event.stopPropagation();
      var location = $(event.currentTarget).attr('href');
      if (location.indexOf('http') !== -1) {
        window.location = location;
      } else {
        Backbone.history.navigate(location, { trigger: true });
      }
    }
  });

});
