
define([
  'underscore',
  'backbone',
  'models/repoFile'
], function(_, Backbone, RepoFileModel) {

  var Collection = Backbone.Collection.extend({
    url: '/api/repoFile',
    model: RepoFileModel,

    comparator: function(repoFile) {
      return repoFile.get('filename');
    }

  });

  return Collection;

});
