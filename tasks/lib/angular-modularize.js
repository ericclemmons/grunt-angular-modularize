var formats = {
  amd:      require('./formats/amd'),
  commonjs: require('./formats/commonjs')
};

var Modularize = function(format) {
  if (!formats[format]) {
    throw new Error('Unknown format "' + format + '"');
  }

  this.format = function(src) {
    var compact = src.replace(/\s/g, '');
    var slice   = compact.substr(0, compact.indexOf(']') + 1);
    var modules = slice.split(/('|")/).filter(function(part) {
      return part.match(/^[\w\._-]+$/);
    });

    return formats[format](modules.shift(), modules, src);
  };
};

module.exports = Modularize;
