define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'text!./form.html'
], function($, _, Backbone, UserModel, formTemplate) {

  var SignupView = Backbone.View.extend({
    tagName: 'section',
    events: {
      'click #signup_button': 'signup'
    },

    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.append(this.make('form', { 'class': 'well span4 offset4' }, _.template(formTemplate)));
      return this;
    },

    signup: function() {
      var values = {};
      this.$('input').each(function() {
        values[this.name] = $(this).val();
      });

      var self = this;
      var user = new UserModel();
      user.save(values, {
        error: function(model, response) {
          console.log(model);
          console.log(response);
        },
        success: function(model, response) {
          console.log(model);
          console.log(response);
          console.log(self.vent);
          // this.vent.trigger('renderNotification', 'An email has been sent to you', 'success');
        }
      });
      return false;
    }


  });

  return SignupView;

});
