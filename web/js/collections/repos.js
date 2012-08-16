
define([
  'underscore',
  'backbone',
  'models/repo'
], function(_, Backbone, RepoModel) {

  var Collection = Backbone.Collection.extend({
    url: '/api/repo',
    model: RepoModel,

    comparator: function(repo) {
      return repo.get('name');
    }
  });

  return Collection;

});
