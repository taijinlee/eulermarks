
define([
  'underscore',
  'backbone',
  'models/repo'
], function(_, Backbone, RepoModel) {

  var Collection = Backbone.Collection.extend({
    url: '/api/repo',
    model: RepoModel
  });

  return Collection;

});
