var fs = require('fs');


var AMD = function(options) {
  this.options = options;
};

AMD.prototype.format = function(src, deps) {
  var template = fs.readFileSync(__dirname + '/../templates/module-amd.js.tmpl', 'utf8');

  return template
    .replace('URLS',    JSON.stringify(this.urls(deps)))
    .replace('SOURCE',  src.replace(/^|\n/g, '\n  '))
  ;
};

AMD.prototype.bootstrap = function(modules) {
  var template = fs.readFileSync(__dirname + '/../templates/bootstrap-amd.js.tmpl', 'utf8');

  return template
    .replace('MODULES',   JSON.stringify(this.filterModules(modules), null, 2).replace(/\n/g, '\n  '))
    .replace('REQUIRES',  JSON.stringify(this.options.requires, null, 2))
    .replace('PATHS',     JSON.stringify(this.options.paths, null, 2).replace(/\n/g, '\n  '))
  ;
};

AMD.prototype.urls = function(modules) {
  var paths = this.options.paths;

  return modules
    .filter(function(module) {
      return Object.keys(paths).filter(function(namespace) {
        return module.indexOf(namespace) === 0;
      }).length;
    })
    .map(function(module) {
      return dep.replace(/\./g, '/');
    })
  ;
};

module.exports = AMD;
