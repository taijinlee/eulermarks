define([
  'backbone-web'
], function(BackboneWebmodel) {

  var Model = BackboneWebmodel.extend({
    urlRoot: '', // none

    schema: {
      userId: { type: 'string', defaults: null }
    }

  });

  return Model;

});
