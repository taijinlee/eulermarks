define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'collections/repoFiles',
  'views/lib/profilePicture/profilePicture',
  'views/lib/tableListView/tableListView',
  'text!./benchmarks.html'
], function($, _, Backbone, UserModel, RepoFileCollection, ProfilePictureView, TableListView, benchmarksTemplate) {

  var View = Backbone.View.extend({
    events: {
    },

    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.userId = args[0];
      this.user = new UserModel({ id: this.userId });
      this.user.on('change', this.renderUserDetails, this);

      this.repoId = args[0] + '/' + args[1];
      this.repoName = args[1];

      this.repoFiles = new RepoFileCollection();
      this.repoFiles.on('reset', this.renderRepoBenchmarks, this);

      this.profile = new ProfilePictureView();
      this.repoFilesTable = new TableListView();
    },

    render: function(id) {
      this.$el.html(_.template(benchmarksTemplate, { repoName: this.repoName }));

      var self = this;
      this.user.fetch({
        success: function(user, response) {
          self.vent.trigger('load:user', user);
        },
        error: function(error) {
          Backbone.history.navigate('', true);
        }
      });

      this.repoFiles.fetch({
        data: { repoId: this.repoId }
      });

      return this;
    },

    renderRepoBenchmarks: function() {
      var keys = [
        { key: 'filename', display: 'File' },
        { key: 'runTime', display: 'Run Time (ms)' }
      ];

      var repoFiles = this.repoFiles.map(function(model) {
        var modelData = model.toJSON();
        var emptyResults = {
          runTime: null
        };

        return _.extend({ filename: modelData.filename }, _.extend(emptyResults, modelData.results));
      }, this);

      this.repoFilesTable.setElement(this.$('#repo-benchmarks')).render(keys, repoFiles, 'This repository has no files');
      return this;
    },

    renderUserDetails: function(user) {
      var userData = user.toJSON();
      this.profile.setElement(this.$('#user-profile')).render(userData.avatarUrl, userData.id, userData.id);
      return this;
    },

    linkRepo: function(event) {
      var select = this.$('#user-linkRepo select');
      var repoName = select.select2('val');
      if (!repoName) {
        return false; // do nothing
      }
      var repo = this.unregisteredRepos.find(function(repo) { return repo.get('name') === repoName; });

      var self = this;
      repo.save({}, {
        success: function() {
          select.select2('val', '');
          self.unregisteredRepos.remove(repo);
          self.repos.add(repo);
        }
      });
    },

    unlinkRepo: function(event) {
      var repoName = $(event.currentTarget).attr('data-repoName');
      var repo = this.repos.find(function(repo) { return repo.get('name') === repoName; });

      var self = this;
      var select = this.$('#user-linkRepo select');

      repo.destroy({
        success: function() {
          select.select2('val', '');
          repo.unset('id');
          self.unregisteredRepos.add(repo);
        }
      });
      return false;
    }

  });

  return View;

});
