
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/user',

    schema: {
      id: { type: 'string', optional: true },
      avatarUrl: { type: 'string' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
