var fs    = require('fs');
var path  = require('path');

var AMD = function(options) {
  this.options = options;
};

AMD.prototype.main = function(modules) {
  var names     = [];
  var template  = fs.readFileSync(__dirname + '/../templates/main-amd.js.tmpl', 'utf8');

  for (var name in modules) {
    names.push(name);
  };

  return template
    .replace('MODULES',   JSON.stringify(names, null, 2).replace(/\n/g, '\n    '))
    .replace('REQUIRES',  JSON.stringify(this.options.requires, null, 2))
    .replace('PATHS',     JSON.stringify(this.options.paths, null, 2).replace(/\n/g, '\n  '))
  ;
};

AMD.prototype.configure = function(grunt, name, file) {
  grunt.config(['requirejs', name], {
    options: {
      name:           name.split('.').join('/'),
      mainConfigFile: file,
      out:            file
    }
  });
};

AMD.prototype.format = function(module) {
  var template = fs.readFileSync(__dirname + '/../templates/module-amd.js.tmpl', 'utf8');
  var urls      = module.filtered.map(function(submodule) {
    return submodule.replace(/\./g, '/');
  });

  return template
    .replace('URLS',    JSON.stringify(urls))
    .replace('CONTENT', module.content.replace(/^|\n/g, '\n  '))
  ;
};

module.exports = AMD;
