define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var ProfilePictureView = Backbone.View.extend({
    tagName: 'section',
    attributes: {
      'class': 'profilePicture'
    },

    initialize: function(vent, pather, cookie, args) {

    },

    render: function(profileType, imgSrc, caption, profileUrl) {
      this.$el.addClass(profileType);

      var image = this.make('img', { 'class': 'thumbnail', src: imgSrc });
      // wrap it in a link if we have a url
      if (profileUrl) {
        image = this.make('a', { href: profileUrl }, image);
      }
      this.$el.append(image);

      if (caption !== undefined && caption.trim().length) {
        this.$el.append(this.make('aside', { 'class': 'cpation' }, caption));
      }

      return this;
    }

  });
  return ProfilePictureView;

});
