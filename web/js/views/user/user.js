define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'collections/repos',
  'views/lib/profilePicture/profilePicture',
  'views/lib/tableListView/tableListView',
  'text!./user.html',
  'text!./repoSelector.html',
  'select2'
], function($, _, Backbone, UserModel, RepoCollection, ProfilePictureView, TableListView, userTemplate, repoSelectorTemplate, select2Dummy) {

  var View = Backbone.View.extend({
    events: {
      'click #linkRepo': 'linkRepo',
      'click .user-repoUnlink': 'unlinkRepo'
    },

    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      this.userId = args[0];
      this.user = new UserModel({ id: this.userId });
      this.user.on('change', this.renderUserDetails, this);

      this.repos = new RepoCollection();
      this.repos.on('reset', this.renderUserRepos, this);
      this.repos.on('add', this.renderUserRepos, this);
      this.repos.on('remove', this.renderUserRepos, this);


      this.unregisteredRepos = new RepoCollection();
      this.unregisteredRepos.url = '/api/repo/unregistered';
      this.unregisteredRepos.on('reset', this.renderUnregisteredRepos, this);
      this.unregisteredRepos.on('add', this.populateSelect, this);
      this.unregisteredRepos.on('remove', this.populateSelect, this);

      this.profile = new ProfilePictureView();
      this.reposTable = new TableListView();
    },

    render: function() {
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

      this.unregisteredRepos.fetch({
        data: { userId: this.userId }
      });

      return this;
    },

    renderUserRepos: function() {
      var keys = [
        { key: 'repoLink', display: 'Repository' },
        { key: 'status', display: 'Status' },
        { key: 'actions', display: '' }
      ];

      var reposWithAction = this.repos.map(function(repo) {
        var repoJSON = repo.toJSON();
        var repoPath = this.pather.getUrl('repo', { userId: repoJSON.userId, repoName: repoJSON.name });
        repoJSON.repoLink = this.make('a', { 'href': repoPath }, repoJSON.name).outerHTML;
        repoJSON.actions = this.make('button', { 'class': 'btn btn-danger user-repoUnlink', 'data-repoName': repoJSON.name }, 'Unlink').outerHTML;
        return repoJSON;
      }, this);

      this.reposTable.setElement(this.$('#user-repos')).render(keys, reposWithAction);
      return this;
    },

    renderUnregisteredRepos: function() {
      var repoSelector = this.$('#user-linkRepo');
      var select = $(this.make('select'));
      select.append(this.make('option', {}, ''));

      repoSelector.append(select);

      this.populateSelect();
      select.select2({
        placeholder: 'Link repository',
        allowClear: true,
        width: '300px'
      });

      repoSelector.append(this.make('button', { 'class': 'btn', id:'linkRepo' }, 'Link'));

      return this;
    },

    populateSelect: function() {
      var select = this.$('#user-linkRepo select');

      select.find('option:gt(0)').remove();
      this.unregisteredRepos.each(function(repo) {
        select.append(this.make('option', { value: repo.get('name') }, repo.get('name')));
      }, this);
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
