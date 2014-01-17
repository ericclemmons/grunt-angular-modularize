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

    // Files are entry-points
    this.files.forEach(function(f) {
      var files = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }

        return true;
      });

      if (!files.length) {
        grunt.log.warn('No files found.');

        return false;
      }

      // Modularize each entry-point as it's own bootstrapp-able app
      files.forEach(function(file) {
        // Should traverse path for files & modules
        var modularize  = new Modularize(options);
        var modules     = modularize.traverse(file);
        var cwd         = path.dirname(f.dest);
        var entry       = modularize.entry();

        // Entry-point should contain modules as registered by `paths`
        if (!Object.keys(modules).length) {
          grunt.log.warn('No modules discovered in "' + f.dest + '"');

          return false;
        }

        // Iterate through all supported modules
        for (var to in modules) {
          var dest    = modularize.path(to, f.dest);
          var module  = modules[to];

          grunt.file.write(dest, modularize.format(module));
          grunt.log.writeln('File "' + dest + '" created.');
        }

        // Retrieve main module
        var main = modularize.main(f.dest);

        // Write out & configure main file
        if (main) {
          grunt.file.write(main.file, main.content);
          grunt.log.writeln('Main file "' + main.file + '" created.');

          modularize.configure(grunt, main.name, main.file);
          grunt.log.writeln('Configured `requirejs:' + main.name + '"`.');
        } else {
          // Configure entry-point
          modularize.configure(grunt, from, f.dest)
          grunt.log.writeln('Configured `requirejs:' + from + '"`.');
        }
      });
    });
  });

};
