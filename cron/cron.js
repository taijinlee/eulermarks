
module.exports = function() {

  var crons = {};

  var register = function(file, functionName, timeout) {
    crons[file + ':' + functionName] = timeout;
  };

  var run = function() {
    for (fileFunc in crons) {
      (function() {
        var timeout = crons[fileFunc];
        var fileFuncSplit = fileFunc.split(':');
        var func = require(fileFuncSplit[0])()[fileFuncSplit[1]];
        var funcWrap = function() {
          setTimeout(funcWrap, timeout);
          return func();
        };
        return funcWrap();
      })();
    }
  };


  return {
    register: register,
    run: run
  };

};
