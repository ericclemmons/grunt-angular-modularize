/*
 * grunt-angular-modularize
 * https://github.com/ericclemmons/grunt-angular-modularize
 *
 * Copyright (c) 2014 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

var Modularize  = require('../lib/modularize');
var path        = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('ngmodularize', 'Easily convert angular.modules to be AMD/CommonJS-compatible', function() {
    var options = this.options({
      format:   null,
      paths:    {},
      requires: []
    });

    var modularize = new Modularize(options);

    this.files.forEach(function(f) {
      var paths = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }

        return true;
      });

      var modules = paths
        .map(grunt.file.read)
        .map(grunt.util.normalizelf)
        .map(modularize.module.bind(modularize))
      ;

      grunt.file.write(f.dest, modules.join(grunt.util.linefeed));
      grunt.log.writeln('File "' + f.dest + '" created.');
    });

    var bootstrap = modularize.bootstrap();

    if (bootstrap) {
      var mainPath = path.join(this.data.dest, 'main.js');

      grunt.file.write(mainPath, bootstrap);
      grunt.log.writeln('Bootstrap "' + mainPath + '" created.');
    }

    modularize.configure(grunt, this);
  });

};
