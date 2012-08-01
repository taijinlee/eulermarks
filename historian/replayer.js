
var _ = require('underscore');

var datastore = 'mongo';
var store = require(process.env.APP_ROOT + '/store/store.js')(datastore, 'localhost', 27017);

store.open(function() {
  var emptyFn = function() {};
  store.retrieve({}, { database: 'logs', collection: 'history'}, function(error, docs) {
    docs = _.sortBy(docs, function(doc) { return doc.created; });
    for (var index in docs) {
      var doc = docs[index];
      var subject = require(process.env.APP_ROOT + '/historian/' + doc.subject + '.js')(store);
      doc.params.push(emptyFn); // empty callback function
      subject[doc.event].apply(subject, doc.params);
    }
    store.close();
  });
});
