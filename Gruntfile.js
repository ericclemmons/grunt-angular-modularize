/*
 * grunt-angular-modularize
 * https://github.com/ericclemmons/grunt-angular-modularize
 *
 * Copyright (c) 2014 Eric Clemmons
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        '<%= nodeunit.tests %>',
        'test/fixtures/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    browserify: {
      simple_cjs: {
        src: 'tmp/simple/cjs/app/bootstrap.js',
        dest: 'tmp/simple/cjs/app/app.build.js'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    ngmodularize: {
      simple_amd: {
        options: {
          format: 'amd',
          requires: ['app/app'],
          paths: {
            app: '../app'
          },
        },
        src:    'examples/simple/app/app.js',
        dest:   'tmp/simple/amd/app/app.js'
      },
      simple_cjs: {
        options: {
          format: 'cjs',
          paths: {
            app: '../app'
          }
        },
        cwd:    'examples/simple/app/bootstrap.js',
        dest:   'tmp/simple/cjs/app/bootstrap.js'
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['default', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['clean', 'jshint', 'ngmodularize', 'requirejs', 'browserify']);

};
