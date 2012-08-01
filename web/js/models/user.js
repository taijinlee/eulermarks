
define([
  'backbone-web'
], function(BackboneWebModel) {

  var Model = BackboneWebModel.extend({
    urlRoot: '/api/user',

    schema: {
      id: { type: 'string', optional: true },
      email: { type: 'email' },
      password: { type: 'string', optional: true },
      wishlistId: { type: 'string', optional: true },
      libraryId: { type: 'string', optional: true },
      created: { type: 'timestamp', defaults: function() { return new Date().getTime(); } }
    }

  });

  return Model;

});
