var amd = function(module, deps, src) {
  var paths = deps.map(function(dep) {
    return dep.replace(/\./g, '/');
  });

  var indented = src.replace(/^|\n/g, '\n  ');

  return 'define(["' + paths.join('", "') + '"], function() {\n' + indented + '\n});\n'
};

module.exports = amd;
