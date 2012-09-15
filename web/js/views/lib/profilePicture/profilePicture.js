define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {

  var View = Backbone.View.extend({
    attributes: {
      'class': 'profilePicture'
    },

    initialize: function(config, vent, pather, cookie) {
    },

    render: function(imgSrc, altText, caption, profileUrl) {
      var imageEl = this.make('img', { 'class': 'thumbnail', src: imgSrc, alt: altText });

      var captionEl;
      if (caption !== undefined && caption.trim().length) {
        captionEl = this.make('aside', { 'class': 'caption' }, caption)
      }

      // wrap image and caption links if we have url
      if (profileUrl) {
        imageEl = this.make('a', { href: profileUrl }, imageEl);
        captionEl = captionEl ? this.make('a', { href: profileUrl }, captionEl) : captionEl;
      }

      this.$el.html(imageEl);
      if (captionEl) {
        this.$el.append(captionEl);
      }

      return this;
    }

  });
  return View;

});
