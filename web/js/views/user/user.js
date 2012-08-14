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
    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.userId = args[0];
      this.user = new UserModel({ id: this.userId });
      this.vent.on('load:user', this.renderUserDetails, this);

      this.repos = new RepoCollection();
      this.repos.on('reset', this.renderUserRepos, this);

      this.unregisteredRepos = new RepoCollection();
      this.unregisteredRepos.url = '/api/repo/unregistered';
      this.unregisteredRepos.on('reset', this.renderUnregisteredRepos, this);

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

    renderUserRepos: function(repos) {
      var keys = [
        { key: 'name', display: 'Repository' },
        { key: 'status', display: 'Status' },
        { key: 'actions', display: this.make('select').outerHTML }
      ];
      this.reposTable.setElement(this.$('#user-repos')).render(keys, repos.map(function(model) { return model.toJSON(); }));
      this.unregisteredRepos.fetch({
        data: { userId: this.userId }
      });
      return this;
    },

    renderUnregisteredRepos: function(unregisteredRepos) {
      var select = this.reposTable.$('select')
      select.append(this.make('option', {}, ''));

      var self = this;
      unregisteredRepos.each(function(repo) {
        select.append(self.make('option', {}, repo.get('name')));
      });
      console.log(select);

      $(select).select2({
        placeholder: 'Link repository',
        allowClear: true,
        width: '300px'
      });
      return this;
    },

    renderUserDetails: function(user) {
      var userData = user.toJSON();
      this.profile.setElement(this.$('#user-profile')).render(userData.avatarUrl, userData.id, userData.id);
      return this;
    }

  });

  return View;

});
