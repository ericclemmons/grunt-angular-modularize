var fs      = require('fs');
var formats = {
  amd:      require('./formats/amd'),
  commonjs: require('./formats/commonjs')
};

var Modularize = function(options) {
  this.dependencies = [];
  this.options      = options;

  if (!formats[this.options.format]) {
    throw new Error('Unknown format "' + this.options.format + '"');
  }

  if (!Object.keys(this.options.paths).length) {
    throw new Error('No module `paths` defined to modularize');
  }
};

Modularize.prototype.bootstrap = function() {
  var template = fs.readFileSync(__dirname + '/templates/bootstrap-amd.js.tmpl').toString();

  return template
    .replace('DEPENDENCIES',  JSON.stringify(this.dependencies, null, 2).replace(/\n/g, '\n  '))
    .replace('MODULES',       JSON.stringify(this.options.modules, null, 2))
    .replace('PATHS',         JSON.stringify(this.options.paths, null, 2).replace(/\n/g, '\n  '))
  ;

};

Modularize.prototype.format = function(src, deps) {
  var formatter = formats[this.options.format];

  return formatter(src, deps);
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

  var filtered = modules.filter(function(module) {
    var matches = Object.keys(this.options.paths).filter(function(namespace) {
      return module.indexOf(namespace) === 0;
    });

    return matches.length;
  }.bind(this));

  filtered.forEach(function(dep) {
    if (this.dependencies.indexOf(dep) === -1) {
      this.dependencies.push(dep);
    }
  }.bind(this));

  return filtered;
};

module.exports = Modularize;
