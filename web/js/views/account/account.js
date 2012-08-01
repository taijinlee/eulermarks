define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'views/lib/assetUploader/assetUploader',
  'text!views/account/account.html'
], function($, _, Backbone, UserModel, AssetUploaderView, accountTemplate) {

  var AccountView = Backbone.View.extend({
    tagName: 'section',

    events: {
      'click button.update': 'updateUser',
      'click button.delete': 'deleteUser'
    },

    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      var userId = cookie.get('userId');
      this.user = new UserModel({ id: userId });
      this.vent.on('load:user', this.renderAccountForm, this);

      this.assetUploader = new AssetUploaderView(vent, pather, cookie, args);
    },

    render: function(id) {
      var self = this;
      this.user.fetch({
        success: function(user, response) {
          self.vent.trigger('load:user', user);
        },
        error: function(error) {
          Backbone.history.navigate('', true);
        }
      });
      return this;
    },

    renderAccountForm: function(user) {
      this.$el.html($(_.template(accountTemplate, user.toJSON())).addClass('span6 offset3'));
      this.$el.append(this.assetUploader.render(user.get('id'), 'user').el);
      return this;
    },

    updateUser: function() {
      var inputs = {};
      _.each($('form').serializeArray(), function(input) {
        inputs[input.name] = input.value;
      });

      this.user.set(inputs);
      this.user.save();

      return false;
    },

    deleteUser: function() {
      this.user.destroy();
      return false;
    }
  });

  return AccountView;

});
