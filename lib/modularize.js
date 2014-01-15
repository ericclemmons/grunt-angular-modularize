var fs      = require('fs');
var formats = {
  amd:  require('./formats/amd'),
  cjs:  require('./formats/cjs')
};

var Modularize = function(options) {
  if (!options.format) {
    throw new Error('`format` is required');
   }

  if (!formats[options.format]) {
    throw new Error('Unknown format "' + options.format + '"');
  }

  if (!Object.keys(options.paths).length) {
    throw new Error('`paths` is required');
  }

  var Formatter = formats[options.format];

  this.formatter    = new Formatter(options);
  this.modules      = [];
  this.options      = options;
};

Modularize.prototype.bootstrap = function() {
  return this.formatter.bootstrap(this.modules);
};

Modularize.prototype.format = function(module, submodules, content) {
  return this.formatter.format(module, submodules, content);
};

Modularize.prototype.module = function(src) {
  return this.format(src, this.parse(src));
};

Modularize.prototype.parse = function(src) {
  var compact = src.replace(/\s/g, '');
  var slice   = compact.substr(0, compact.indexOf(']') + 1);
  var modules = slice.split(/('|")/).filter(function(part) {
    return part.match(/^[\w\._-]+$/);
  });

  // Register unique, parsed angular modules
  modules.forEach(function(dep) {
    if (this.modules.indexOf(dep) === -1) {
      this.modules.push(dep);
    }
  }.bind(this));

  return modules;
};

module.exports = Modularize;
