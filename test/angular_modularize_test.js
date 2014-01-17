'use strict';

var path        = require('path');
var grunt       = require('grunt');
var Modularize  = require('../lib/modularize');

exports.modularize = {
  path_current: function(test) {
    var m = new Modularize({ format: 'amd', paths: {
      'app': '.'
    }});

    m.modules['app'] = {
      name: 'app',
      file: 'test/my/app.js'
    };

    test.equal('test/my/app.js',              m.path('app'));
    test.equal('test/my/controllers/home.js', m.path('app.controllers.home'));
    test.equal('test/my/routes/home.js',      m.path('app.routes.home'));
    test.done();
  },

  path_subfolder: function(test) {
    var m = new Modularize({ format: 'amd', paths: {
      'app': '../app'
    }});

    m.modules['app'] = {
      name: 'app',
      file: 'test/my/app/app.js'
    };

    test.equal('test/my/app/app.js',              m.path('app'));
    test.equal('test/my/app/controllers/home.js', m.path('app.controllers.home'));
    test.equal('test/my/app/routes/home.js',      m.path('app.routes.home'));
    test.done();
  },

  path_custom: function(test) {
    var m = new Modularize({ format: 'amd', paths: {
      'app.controllers':  './app/controllers',
      'app':              '.'
    }});

    m.modules['app'] = {
      name: 'app',
      file: 'test/my/app.js'
    };

    test.equal('test/my/app.js',                  m.path('app'));
    test.equal('test/my/routes/home.js',          m.path('app.routes.home'));
    test.equal('test/my/app/controllers/home.js', m.path('app.controllers.home'));
    test.done();
  },

  path_relative: function(test) {
    var m = new Modularize({ format: 'amd', paths: {
      'app': '.'
    }});

    m.modules['app'] = {
      name: 'app',
      file: 'test/my/app.js'
    };

    var dest = 'build/my/app.js';

    test.equal('build/my/app.js',              m.path('app', dest));
    test.equal('build/my/controllers/home.js', m.path('app.controllers.home', dest));
    test.equal('build/my/routes/home.js',      m.path('app.routes.home', dest));
    test.done();
  }
};

// var compare = function(file) {
//   return this.equal(
//     grunt.file.read('tmp/' + file),
//     grunt.file.read('test/' + file),
//     'Modularized file does not match example'
//   );
// };

// exports.angular_modularize = {
//   simple_amd: function(test) {
//     [
//       'simple/amd/main.js',
//       'simple/amd/main.build.js',
//       'simple/amd/app/app.js',
//       'simple/amd/app/routes/home.js',
//       'simple/amd/app/controllers/home.js',
//     ].forEach(compare.bind(test));

//     test.done();
//   },

//   simple_cjs: function(test) {
//     [
//       'simple/cjs/app/app.js',
//       'simple/cjs/app/app.build.js',
//       'simple/cjs/app/routes/home.js',
//       'simple/cjs/app/controllers/home.js',
//     ].forEach(compare.bind(test));

//     test.done();
//   },
