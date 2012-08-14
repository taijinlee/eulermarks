
define([
  'validator'
], function(validator) {

  // deal with client side
  if (typeof window !== 'undefined' && (typeof window.Validator === 'function')) {
    validator = window;
  }
  validator.Validator.prototype.error = function(msg) { this._errors.push(new Error(msg)); return this; };
  validator.Validator.prototype.isString = function() {
    if (String(this.str) !== this.str || this.str.length === 0) { return this.error(this.msg || 'Not a string'); }
    return this;
  };

  var _validator = function() { return new validator.Validator(); };
  var _sanitize = validator.sanitize;

  var types = {
    bool: {
      checkType: function(value) { return _validator().check(value).isIn([true, false]); },
      sanitize: function(value) { return _sanitize(value).toBooleanStrict(); }
    },
    email: {
      checkType: function(value) { return _validator().check(value).isEmail(); }
    },
    integer: {
      checkType: function(value) { return _validator().check(value).isInt(); },
      sanitize: function(value) { return _sanitize(value).toInt(); }
    },
    object: {
    },
    string: {
      checkType: function(value) { return _validator().check(value).isString(); },
      sanitize: function(value) { return String(value); }
    },
    timestamp: {
      checkType: function(value) { return _validator().check(value).isInt(); }
    },
    url: {
      checkType: function(value) { return _validator().check(value).isUrl(); },
      sanitize: function(value) { return String(value); }
    },
    userRole: {
      checkType: function(value) { return _validator().check(value).isIn(['user', 'admin']); }
    },
    zip: {
      checkType: function(value) { return _validator().check(value).len(5,5).isInt(); }
    }
  };

  return types;

});
