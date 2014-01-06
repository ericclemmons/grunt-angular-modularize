/*
 * grunt-angular-modularize
 * https://github.com/ericclemmons/grunt-angular-modularize
 *
 * Copyright (c) 2014 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

var Modularize = require('./lib/angular-modularize');

module.exports = function(grunt) {

  grunt.registerMultiTask('ngmodularize', 'Easily convert angular.modules to be AMD/CommonJS-compatible', function() {
    var options = this.options({
      format: 'amd'
    });

    var modularize = new Modularize(options.format);

    this.files.forEach(function(f) {
      var paths = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }

        return true;
      });

      var src = paths
        .map(grunt.file.read)
        .map(grunt.util.normalizelf)
        .map(modularize.format)
        .join(grunt.util.linefeed)
      ;

      grunt.file.write(f.dest, src);

      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
