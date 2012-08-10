
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/repo',

    schema: {
      id: { type: 'string', optional: true },
      userId: { type: 'string' },
      name: { type: 'string' },
      htmlUrl: { type: 'url' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
