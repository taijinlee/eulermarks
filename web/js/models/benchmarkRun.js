
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/benchmarkRun',

    schema: {
      id: { type: 'string', optional: true },
      userId: { type: 'string' },
      repo: { type: 'string' },
      filename: { type: 'string' },
      sha: { type: 'string' },
      results: { type: 'object' },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
