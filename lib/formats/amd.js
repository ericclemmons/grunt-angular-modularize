var fs    = require('fs');
var path  = require('path');

var AMD = function(options) {
  this.options = options;
};

AMD.prototype.bootstrap = function(modules) {
  var template = fs.readFileSync(__dirname + '/../templates/bootstrap-amd.js.tmpl', 'utf8');

  return template
    .replace('MODULES',   JSON.stringify(this.filter(modules), null, 2).replace(/\n/g, '\n  '))
    .replace('REQUIRES',  JSON.stringify(this.options.requires, null, 2))
    .replace('PATHS',     JSON.stringify(this.options.paths, null, 2).replace(/\n/g, '\n  '))
  ;
};

AMD.prototype.configure = function(grunt, task) {
  grunt.config(['requirejs', task.target], {
    options: {
      name: 'main',
      mainConfigFile: path.join(task.data.dest, 'main.js'),
      out: path.join(task.data.dest, 'main.build.js'),
    }
  });
};

AMD.prototype.filter = function(modules) {
  var paths = this.options.paths;

  return modules.filter(function(module) {
    return Object.keys(paths).filter(function(namespace) {
      return module.indexOf(namespace) === 0;
    }).length;
  });
};

AMD.prototype.format = function(module, submodules, content) {
  var template = fs.readFileSync(__dirname + '/../templates/module-amd.js.tmpl', 'utf8');

  return template
    .replace('URLS',    JSON.stringify(this.urls(submodules)))
    .replace('CONTENT', content.replace(/^|\n/g, '\n  '))
  ;
};

AMD.prototype.urls = function(submodules) {
  return this.filter(submodules).map(function(submodule) {
    return submodule.replace(/\./g, '/');
  });
};

module.exports = AMD;
