
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/repoFile',

    schema: {
      id: { type: 'string', optional: true },
      repoId: { type: 'string' },
      filename: { type: 'string' },
      results: { type: 'object' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
