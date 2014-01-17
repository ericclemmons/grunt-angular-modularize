var fs    = require('fs');
var path  = require('path');

var CJS = function(options) {
  this.options = options;
};

CJS.prototype.configure = function(grunt, name, file) {
  grunt.config(['browserify', name], {
    src: file,
    dest: file.substr(0, file.lastIndexOf('.')) + '.dist.js'
  });
};

CJS.prototype.format = function(module) {
  var template  = fs.readFileSync(__dirname + '/../templates/module-cjs.js.tmpl', 'utf8');
  var urls      = module.filtered
    .map(function(submodule) {
      var froms = module.name.split('.');
      var tos   = submodule.split('.');

      // Calculate common denominator
      while (froms.length && tos.length && (froms[0] === tos[0])) {
        froms.shift();
        tos.shift();
      }

      // Traverse to common denominator from input file
      var url = path.join.apply(path, [
        module.file,
        new Array(froms.length).join('../')
      ].concat(tos));

      url = path.relative(module.file, url);

      if (url.substr(0, 3) !== '../') {
        url = './' + url;
      }

      return url;
    })

    .map(function(url) {
      return "require('" + url + "');\n";
    })
  ;

  return template
    .replace('SUBMODULES',  urls)
    .replace('CONTENT',     module.content)
  ;
};

CJS.prototype.urls = function(module, submodules) {
  var paths = this.options.paths;

  return this.filter(submodules).map(function(submodule) {
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
  });
}

module.exports = CJS;
