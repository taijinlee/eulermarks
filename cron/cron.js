
module.exports = function() {

  var crons = [];

  var register = function(timeout, func, args) {
    if (args !== undefined) { args = Array.prototype.slice.call(arguments, 2); }
    crons.push({ func: func, timeout: timeout, args: args });
  };

  var run = function() {
    for (var i = 0; i < crons.length; i++) {
      (function() {
        var timeout = crons[i].timeout;
        var args = crons[i].args;
        var func = crons[i].func;
        var funcWrap = function() {
          setTimeout(funcWrap, timeout);
          return func.apply(null, args);
        };
        return funcWrap();
      }());
    }
  };

  return {
    register: register,
    run: run
  };

};
