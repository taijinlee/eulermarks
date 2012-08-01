var childProcess = require('child_process');
var _ = require('underscore');
var util = require('util');

childProcess.exec('npm list', function(error, stdout, stderr) {
  if (error) { throw error; }

  var packages = stdout.split("\n");
  packages.shift();

  _.each(packages, function(_package) {
    // only want base packages
    if (_package[0] !== '├') { return; }
    var packageDetails = _package.match(/([a-zA-Z0-9_\-]+)@([\d\.]+)/);
    var packageName = packageDetails[1];
    var installedVersion = packageDetails[2];

    childProcess.exec('npm show ' + packageName + ' versions', function(error, stdout, stderr) {
      if (error) { throw error; }
      var versions = JSON.parse(stdout.trim().replace(/'/g, '"', 'g'));
      var latestVersion = versions.pop();

      if (installedVersion === latestVersion) {
        console.log(util.format('%s at latest version', packageName));
      } else {
        console.log(util.format('%s not at latest version. Currently at %s, latest is %s', packageName, installedVersion, latestVersion));
      }
    });
  });
});
