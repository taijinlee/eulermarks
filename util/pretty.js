#!/usr/bin/env node

var clc = require('cli-color');

process.stdin.resume();
process.stdin.on('data', function(data) {

  var dateColor = function(dateString) {
    return clc.white(dateString);
  };

  var statusColor = function(statusString, status) {
    var colorizer;
    if (status >= 500) { colorizer = clc.red; }
    else if (status >= 400) { colorizer = clc.yellow; }
    else if (status >= 300) { colorizer = clc.cyan; }
    else { colorizer = clc.green; }
    return colorizer.call(null, statusString);
  };

  var responseTimeColor = function(responseTimeString, responseTime) {
    var colorizer;
    if (responseTime >= 50) { colorizer = clc.red.bold; }
    else if (responseTime >= 30) { colorizer = clc.yellow; }
    else if (responseTime >= 15) { colorizer = clc.cyan; }
    else { colorizer = clc.green; }

    return colorizer.call(null, responseTimeString);
  };

  var methodColor = function(methodString) {
    return clc.gray(methodString);
  };

  var urlColor = function(urlString) {
    return clc.yellow(urlString);
  };

  var referrerColor = function(referrerString) {
    return clc.magenta.bright(referrerString);
  };

  var lines = data.toString().split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }
    var prettified = JSON.stringify(JSON.parse(lines[i]), null);

    prettified = '\033[90m' + prettified + '\033[0m';
    prettified = prettified.replace(/\\n/g, "\n").replace(/"/g, '').replace(/,/g, ', ');
    prettified = prettified.replace(/date:[\w\s:\(\)]*/, dateColor);
    prettified = prettified.replace(/status:(\d+)/g, statusColor);
    prettified = prettified.replace(/response_time:([\d\-]+)/g, responseTimeColor);
    prettified = prettified.replace(/method:([A-Z]+)/, methodColor);
    prettified = prettified.replace(/url:([\w=\+\?\.\/\-]+)/, urlColor);
    prettified = prettified.replace(/referrer:[\w:\/\.\-]*/g, referrerColor);

    process.stdout.write(prettified + "\n");
  }

});
