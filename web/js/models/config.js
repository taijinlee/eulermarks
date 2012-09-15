define([
  'backbone-web'
], function(BackboneWebmodel) {

  var Model = BackboneWebmodel.extend({
    urlRoot: '/api/config',

    schema: {
      // fluid
    }

  });

  return Model;

});
