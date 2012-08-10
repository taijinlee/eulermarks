define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'collections/repos',
  'views/lib/profilePicture/profilePicture',
  'views/lib/tableListView/tableListView',
  'text!./user.html'
], function($, _, Backbone, UserModel, RepoCollection, ProfilePictureView, TableListView, userTemplate) {

  var View = Backbone.View.extend({
    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.userId = args[0];
      this.user = new UserModel({ id: this.userId });
      this.vent.on('load:user', this.renderUserDetails, this);

      this.repos = new RepoCollection();
      this.repos.on('reset', this.renderUserRepos, this);

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
      if (repos.isEmpty()) {
        this.$('#user-repos').html(this.make('p', {}, 'No repositories linked. Link one now'));
      } else {
        var keys = [{ key: 'name', display: 'Repository' }];
        this.reposTable.setElement(this.$('#user-repos')).render(keys, repos.map(function(model) { return model.toJSON(); }));
      }
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
