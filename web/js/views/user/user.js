define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'collections/repos',
  'views/lib/profilePicture/profilePicture',
  'views/lib/tableListView/tableListView',
  'text!./user.html',
  'select2'
], function($, _, Backbone, UserModel, RepoCollection, ProfilePictureView, TableListView, userTemplate, select2Dummy) {

  var View = Backbone.View.extend({
    events: {
      'click #linkRepo': 'linkRepo'
    },


    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.userId = args[0];
      this.user = new UserModel({ id: this.userId });
      this.vent.on('load:user', this.renderUserDetails, this);

      this.repos = new RepoCollection();
      this.repos.on('reset', this.renderUserRepos, this);
      this.repos.on('add', this.renderUserRepos, this);

      this.unregisteredRepos = new RepoCollection();
      this.unregisteredRepos.url = '/api/repo/unregistered';
      this.unregisteredRepos.on('reset', this.renderUnregisteredRepos, this);
      this.unregisteredRepos.on('remove', this.renderUnregisteredRepos, this);

      this.profile = new ProfilePictureView();
      this.reposTable = new TableListView();
    },

    render: function(id) {
      this.$el.html(_.template(userTemplate));

      var self = this;
      this.user.fetch({
        success: function(user, response) {
          self.vent.trigger('load:user', user);
        },
        error: function(error) {
          Backbone.history.navigate('', true);
        }
      });

      this.repos.fetch({
        data: { userId: this.userId }
      });
      return this;
    },

    renderUserRepos: function() {
      console.log(repos);
      var keys = [
        { key: 'name', display: 'Repository' },
        { key: 'status', display: 'Status' },
        { key: 'actions', display: this.make('aside', { id: 'repo-selector' }).outerHTML }
      ];
      var self = this;
      this.reposTable.setElement(this.$('#user-repos')).render(keys, self.repos.map(function(model) { return model.toJSON(); }));
      this.unregisteredRepos.fetch({
        data: { userId: this.userId }
      });
      return this;
    },

    renderUnregisteredRepos: function() {
      var select = $(this.make('select'));
      select.append(this.make('option', {}, ''));

      var self = this;
      this.unregisteredRepos.each(function(repo) {
        select.append(self.make('option', { value: repo.get('name') }, repo.get('name')));
      });

      var repoSelector = this.reposTable.$('#repo-selector');
      repoSelector.html(select);
      select.select2({
        placeholder: 'Link repository',
        allowClear: true,
        width: '300px'
      });

      var linkRepoButton = this.make('button', { 'class': 'btn', id: 'linkRepo' }, 'Link');
      repoSelector.append(linkRepoButton);

      return this;
    },

    renderUserDetails: function(user) {
      var userData = user.toJSON();
      this.profile.setElement(this.$('#user-profile')).render(userData.avatarUrl, userData.id, userData.id);
      return this;
    },

    linkRepo: function(event) {
      var select = this.reposTable.$('#repo-selector select');
      var repoName = select.select2('val');
      if (!repoName) {
        return false; // do nothing
      }
      var repo = this.unregisteredRepos.find(function(repo) { return repo.get('name') === repoName; });

      var self = this;
      repo.save({}, {
        success: function() {
          self.unregisteredRepos.remove(repo);
          self.repos.add(repo);
        }
      });
    }

  });

  return View;

});
