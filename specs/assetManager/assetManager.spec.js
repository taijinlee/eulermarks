
var should = require('should');
var _ = require('underscore');

var store = require(process.env.APP_ROOT + '/store/store.js')('ram');
var Asset = require(process.env.APP_ROOT + '/models/asset.js')(store);
var AssetBlob = require(process.env.APP_ROOT + '/models/assetBlob.js')(store);

var assetManager = require(process.env.APP_ROOT + '/assetManager/assetManager.js')(store);


describe('Asset Manager', function() {

  var _asset = {
    refId: 'myRefId',
    refContext: 'image',
    blob: 'SomeImageBinaryData'
  };

  describe('#save', function() {
    it('should be able to save an asset', function(done) {
      assetManager.save(store.generateId(), _asset.refId, _asset.refContext, _asset.blob, function(error, assetId) {
        should.not.exist(error);

        var asset = new Asset({ id: assetId });
        asset.retrieve(function(error, assetData) {
          should.not.exist(error);

          var assetBlob = new AssetBlob({ hash: assetData.assetBlobHash });
          assetBlob.retrieve(function(error, assetBlobData) {
            should.not.exist(error);

            assetBlobData.blob.should.equal(_asset.blob);
            assetBlobData.hash.should.equal(assetManager.hash(_asset.blob));
          });

          assetData.refId.should.equal(_asset.refId);
          assetData.refContext.should.equal(_asset.refContext);
          assetData.metadata.should.eql({});
          should.exist(assetData.assetBlobHash);
          should.exist(assetData.created);

          // setting for next parts
          _asset.assetBlobHash = assetData.assetBlobHash;
          _asset.id = assetData.id;
        });

        done();
      });
    });

    it('should be able to save and point to same blob when it exists', function(done) {
      assetManager.save(store.generateId(), _asset.refId, _asset.refContext, _asset.blob, function(error, assetId) {
        should.not.exist(error);

        var asset = new Asset({ id: assetId });
        asset.retrieve(function(error, assetData) {
          should.not.exist(error);

          assetData.assetBlobHash.should.equal(_asset.assetBlobHash);
        });

        done();
      });

    });
  });


  describe('#getUrl', function() {
    it('should be able to get a correct url', function(done) {
      assetManager.getUrl(_asset.id, function(error, url) {
        should.not.exist(error);

        // not taking s3 logic into account yet
        url.should.equal('//' + process.env.APP_HOST + '/asset/' + _asset.assetBlobHash);
        done();
      });
    });

  });

});
