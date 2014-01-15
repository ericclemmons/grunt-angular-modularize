var fs    = require('fs');
var path  = require('path');

var CJS = function(options) {
  this.options = options;
};

CJS.prototype.format = function(module, submodules, content) {
  var template  = fs.readFileSync(__dirname + '/../templates/module-cjs.js.tmpl', 'utf8');
  var urls      = this.urls(module, submodules)
    .map(function(url) {
      return "require('" + url + "');\n";
    })
  ;

  return template
    .replace('SUBMODULES',  urls)
    .replace('CONTENT',     content)
  ;
};

CJS.prototype.bootstrap = function(modules) {};

CJS.prototype.urls = function(module, submodules) {
  var paths = this.options.paths;

  return submodules
    .filter(function(submodule) {
      // Submodule is registered in `paths`.
      return Object.keys(paths).filter(function(namespace) {
        return submodule.indexOf(namespace) === 0;
      }).length;
    })
    .map(function(submodule) {
      for (var namespace in paths) {
        if (submodule.indexOf(namespace) !== 0) {
          continue;
        }

        var root  = paths[namespace];
        var depth = module.split('.').length - 1;
        var down  = new Array(depth).join('../');

        var tos   = [down, root].concat(submodule.split('.'));
        var to    = path.join.apply(path, tos);

        if (to.substr(0, 3) !== '../') {
          to = './' + to;
        }

        return to;
      }

      return path.join.apply(path, submodule.split('.'));
    })
  ;
}

module.exports = CJS;
