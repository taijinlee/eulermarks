define([
  'jquery',
  'underscore',
  'backbone',
  'lib/jquery/jquery.form',
  'text!views/lib/assetUploader/assetUploader.html'
], function($, _, Backbone, jqueryForm, assetUploaderTemplate) {

  var AssetUploaderView = Backbone.View.extend({

    tagName: 'section',
    className: 'assetUploader',

    events: {
      'change input#asset': 'formSubmit',
      'click a#asset_upload_button': 'triggerUploaderClick',
    },

    initialize: function(vent, pather, cookie, args) {
      this.vent = vent;
    },

    render: function(refId, refContext) {
      $(this.el).html(_.template(assetUploaderTemplate, { refId: refId, refContext: refContext }));
      return this;
    },

    formSubmit: function() {
      var self = this;
      $('#uploader').ajaxSubmit({
        success: function(response) {
          console.log(response);
          // self.vent.trigger('asset_uploaded', [JSON.parse(response)]);
        }
      });
    },

    triggerUploaderClick: function() {
      $('#asset').click();
      return false;
    }

  });

  return AssetUploaderView;

});
