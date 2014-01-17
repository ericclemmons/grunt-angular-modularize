var fs      = require('fs');
var path    = require('path');
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
  this.modules      = {};
  this.options      = options;
};

Modularize.prototype.entry = function() {
  // First module is the entry-point
  for (var name in this.modules) {
    break;
  }

  return this.modules[name];
};

Modularize.prototype.main = function(from) {
  if (typeof this.formatter.main !== 'function') {
    return false;
  }

  // Remove tail-end of entry-point & add "main"
  var entry = this.entry();
  var name  = entry.name.split('.').concat(['main']).join('.');

  return {
    name:       name,
    file:       this.path(name, from || entry.file),
    content:    this.formatter.main(this.modules),
    submodules: [],
    filtered:   [],
  };
};

Modularize.prototype.configure = function(grunt, name, main) {
  return this.formatter.configure(grunt, name, main);
};

Modularize.prototype.format = function(module) {
  return this.formatter.format(module);
};

Modularize.prototype.parse = function(file) {
  var content = fs.readFileSync(file, 'utf8');
  var compact = content.replace(/\s/g, '');
  var slice   = compact.substr(0, compact.indexOf(']') + 1);
  var modules = slice.split(/('|")/).filter(function(part) {
    return part.match(/^[\w\._-]+$/);
  });

  var module = {
    name:       modules.shift(),
    file:       file,
    content:    content,
    submodules: modules,
    filtered:   this.filter(modules)
  };

  this.modules[module.name] = module;

  return module;
};

Modularize.prototype.filter = function(modules) {
  var paths = this.options.paths;

  return modules
    .filter(this.supports.bind(this))
    .filter(function(module) {
      return !this.modules[module.name];
    }.bind(this))
  ;
};

Modularize.prototype.path = function(module, from) {
  from = from || this.entry().file;

  for (var namespace in this.options.paths) {
    if (module.indexOf(namespace) !== 0) {
      continue;
    }

    var offset  = this.options.paths[namespace];
    var depth   = this.entry().name.split('.').length;
    var down    = new Array(depth + 1).join('../');
    var tos     = module.split('.').slice(namespace.split('.').length);

    // Root-level namespaces live in folder root
    if (!tos.length) {
      tos = tos.concat(namespace.split('.'));
    }

    var dirs  = [
      from,         // Entry-point file
      down,         // Navigate up out of of entry-point
      offset        // Navigate into namespace
    ].concat(tos);  //

    return path.join.apply(path, dirs) + '.js';
  }

  throw new Error('Module "' + module + '" not registered in `paths`.');
};

Modularize.prototype.traverse = function(file, callback) {
  var module = this.parse(file);

  this.filter(module.submodules).forEach(function(submodule) {
    this.traverse(this.path(submodule));
  }.bind(this));

  return this.modules;
};

Modularize.prototype.supports = function(module) {
  for (var namespace in this.options.paths) {
    if (module.indexOf(namespace) === 0) {
      return this.options.paths[namespace];
    }
  }

  return false;
};

module.exports = Modularize;
