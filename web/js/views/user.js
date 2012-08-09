define([
  'jquery',
  'underscore',
  'backbone',
  'models/user'
], function($, _, Backbone, UserModel) {

  var View = Backbone.View.extend({
    tagName: 'section',

    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      var userId = cookie.get('userId');
      this.user = new UserModel({ id: userId });
      //this.vent.on('load:user', this.renderAccountForm, this);
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
    }

  });

  return View;

});
