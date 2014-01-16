'use strict';

var grunt = require('grunt');

var compare = function(file) {
  return this.equal(
    grunt.file.read('tmp/' + file),
    grunt.file.read('test/' + file),
    'Modularized file does not match example'
  );
};

exports.angular_modularize = {
  simple_amd: function(test) {
    [
      'simple/amd/main.js',
      'simple/amd/main.build.js',
      'simple/amd/app/app.js',
      'simple/amd/app/routes/home.js',
      'simple/amd/app/controllers/home.js',
    ].forEach(compare.bind(test));

    test.done();
  },

  simple_cjs: function(test) {
    [
      'simple/cjs/app/app.js',
      'simple/cjs/app/app.build.js',
      'simple/cjs/app/routes/home.js',
      'simple/cjs/app/controllers/home.js',
    ].forEach(compare.bind(test));

    test.done();
  },
};
