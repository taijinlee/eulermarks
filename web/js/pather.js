
define([
], function() {
  var Pather = function(paths) {

    var _paths = paths;

    // helper function
    var formattedPaths;
    var formatPaths = function() {
      if (formattedPaths) { return formattedPaths; }
      formattedPaths = {};
      for (var i = 0 ; i < _paths.length; ++i) {
        formattedPaths[_paths[i].symName] = _paths[i].urlFragment;
      }
      return formattedPaths;
    };

    // args as an object literal
    this.getUrl = function(symName, args) {
      args = args || {}; // default it to empty object
      var _formattedPaths = formatPaths();
      if (!_formattedPaths.hasOwnProperty(symName)) {
        // fail badly so that we catch this in dev
        throw new Error('path does not exist: ' + symName);
      }

      var url = _formattedPaths[symName].replace(/:(\w+)/g, function(origString, key) {
        return args.hasOwnProperty(key) ? args[key] : origString;
      });

      // if we still find a : that isn't replaced, then something is wrong with the inputs
      if (url.indexOf(':') !== -1) {
        throw new Error('invalid arguments');
      }
      return '/' + url;
    };

  };

  return Pather;

});
