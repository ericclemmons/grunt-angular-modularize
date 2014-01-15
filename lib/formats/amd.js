var fs = require('fs');


var AMD = function(options) {
  if (!Object.keys(options.paths).length) {
    throw new Error('RequireJS needs `paths` to be defined');
  }

  this.options = options;
};

AMD.prototype.format = function(src, deps) {
  var paths     = this.options.paths;
  var template  = fs.readFileSync(__dirname + '/../templates/module-amd.js.tmpl', 'utf8');
  var urls      = this.filterModules(deps).map(function(dep) {
    return dep.replace(/\./g, '/');
  });

  return template
    .replace('URLS',    JSON.stringify(urls))
    .replace('SOURCE',  src.replace(/^|\n/g, '\n  '))
  ;
};

AMD.prototype.filterModules = function(modules) {
  var paths = this.options.paths;

  return modules.filter(function(module) {
    return Object.keys(paths).filter(function(namespace) {
      return module.indexOf(namespace) === 0;
    }).length;
  });
}

AMD.prototype.bootstrap = function(modules) {
  var template = fs.readFileSync(__dirname + '/../templates/bootstrap-amd.js.tmpl', 'utf8');

  return template
    .replace('MODULES',   JSON.stringify(this.filterModules(modules), null, 2).replace(/\n/g, '\n  '))
    .replace('REQUIRES',  JSON.stringify(this.options.requires, null, 2))
    .replace('PATHS',     JSON.stringify(this.options.paths, null, 2).replace(/\n/g, '\n  '))
  ;
}

module.exports = AMD;
