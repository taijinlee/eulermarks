define([
  'jquery',
  'underscore',
  'backbone',
  'models/user',
  'text!./form.html'
], function($, _, Backbone, UserModel, formTemplate) {

  var LoginView = Backbone.View.extend({
    tagName: 'section',
    events: {
      'click #login_button': 'login'
    },

    initialize: function(vent, pather, cookie, args) {
      this.vent = vent; this.pather = pather; this.cookie = cookie;
    },

    render: function() {
      this.$el.append(this.make('form', { 'class': 'well span4 offset4' }, _.template(formTemplate)));
      return this;
    },

    login: function() {
      var values = {};
      this.$('input').each(function() {
        values[this.name] = $(this).val();
      });

      $.ajax({
        url: '/api/auth/login',
        type: 'post',
        data: $.param(values),
        success: function(result) {
          Backbone.history.navigate('account', true);
          console.log(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        }
      });

      return false;
    }


  });

  return LoginView;

});
