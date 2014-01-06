var amd = function(src, deps) {
  var indented  = src.replace(/^|\n/g, '\n  ');
  var paths     = deps.map(function(dep) {
    return dep.replace(/\./g, '/');
  });

  return 'define(' + JSON.stringify(paths) + ', function() {\n' + indented + '\n});\n';
};

module.exports = amd;
