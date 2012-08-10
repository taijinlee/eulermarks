define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'text!./user.html'
], function($, _, Backbone, UserModel, userTemplate) {

  var View = Backbone.View.extend({
    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;

      var userId = args[0];
      this.user = new UserModel({ id: userId });
      this.vent.on('load:user', this.renderUserDetails, this);
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
      return this;
    },

    renderUserDetails: function(user) {
      // this.$el.html($(_.template(accountTemplate, user.toJSON())).addClass('span6 offset3'));
      // this.$el.append(this.assetUploader.render(user.get('id'), 'user').el);
      console.log('hi');
      return this;
    }

  });

  return View;

});
