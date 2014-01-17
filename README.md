# grunt-angular-modularize

[![Build Status](https://travis-ci.org/ericclemmons/grunt-angular-modularize.png)](https://travis-ci.org/ericclemmons/grunt-angular-modularize)
[![Dependencies](https://david-dm.org/ericclemmons/grunt-angular-modularize.png)](https://david-dm.org/ericclemmons/grunt-angular-modularize)
[![devDependencies](https://david-dm.org/ericclemmons/grunt-angular-modularize/dev-status.png)](https://david-dm.org/ericclemmons/grunt-angular-modularize#info=devDependencies&view=table)

> Write AngularJS Modules Once.
> Build with [RequireJS][4] (AMD),
> [Browserify][5] (CommonJS),
> or simply [concat][3].

Using a [Simple Example](https://github.com/ericclemmons/grunt-angular-modularize/tree/master/examples/simple)
as the input:

- [Simple RequireJS (AMD) Demo](https://rawgithub.com/ericclemmons/grunt-angular-modularize/master/examples/simple/amd.html)
- [Simple RequireJS (AMD) Output](https://github.com/ericclemmons/grunt-angular-modularize/tree/master/test/simple/amd/app)
- [Simple Browserify (CommonJS) Demo](https://rawgithub.com/ericclemmons/grunt-angular-modularize/master/examples/simple/cjs.html)
- [Simple RequireJS (CommonJS) Output](https://github.com/ericclemmons/grunt-angular-modularize/tree/master/test/simple/cjs/app)

*These demos may need to be refreshed upon loading.*


## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Changelog](#changelog)
- [License](#license)


## Installation

*This plugin requires [Grunt][1] `~0.4.1`*

Install the plugin:

```shell
$ npm install grunt-angular-modularize --save-dev
```

Enable the plugin within your `Gruntfile.js`

```js
grunt.loadNpmTasks('grunt-angular-modularize');
```


## Usage


### 1. Properly structure your AngularJS app

- Each file should be it's own standalone module:

```js
angular
  .module('admin.controllers.home')
  .controller('HomeController', [
    '$scope',
    function($scope) {
      ...
    }
  ])
;
```

- The module name should be able to map to the folder it's in.
(e.g. `admin.controllers.home` may reside in `public/scripts/admin/controllers/home.js`)
- Each file should only require modules that it needs.
- You should use a unique namespace to describe your app to make it easier to separate sections. (e.g. `admin` instead of `app`).
- The root of each section (e.g. `admin.js`) should live within a folder of that namespace and not outside of it.
(e.g. `path/to/src/admin/admin.js` alongside `path/to/src/admin/controllers/home.js`)


### 2. Modify `Gruntfile.js`

*See the [options](#options) below for detailed usage for each option**.

```js
ngmodularize: {
  admin: {
    options: {
      format:   'amd',                    // Can be `cjs` for CommonJS
      requires: ['admin'],                // Used for RequireJS's `main` file...
      paths:    {                         //
        admin:  'admin'                   //
      }                                   //
    },
    src:        'path/to/src/admin.js',   // admin entry-point
    dest:       'path/to/build/admin.js'  // AMD-version of admin entry-point
  }
}
```


### 3. Run `grunt ngmodularize`

```shell
$ grunt ngmodularize
```

This will automatically traverse the entry-point specified in `src` for all
dependencies with a known path (via `paths`) and write out the corresponding
structure alongside the `dest` file.


### 4. Building & Optimization

If you're using [grunt-contrib-requirejs][4] (AMD) or [grunt-browserify][5] (CommonJS),
their tasks are automatically configured for you!

Simply run the appropriate command:

```shell
$ grunt ngmodularize requirejs
```
or
```shell
$ grunt ngmodularize browserify
```

Couple this with [grunt-angular-templates][6], and your entire application
can be reduced to one or two HTTP requests!


## Examples

### Concatenation

- Uses [grunt-contrib-concat][3].
- Easy to setup.
- Only reference build file, not hundreds of individual files.
- Stack trace line numbers don't match source.
- Does not require this plugin.

With a properly structured app (one module per file), AngularJS's DI
handles dependency ordering for you.

Simply add the following to your `Gruntfile.js`:

```js
concat: {
  admin: {
    src:  'path/to/src/admin/**/*.js',
    dest: 'path/to/build/admin/admin.build.js'
  }
},
```

Now, your `index.html` only has to reference one script from now on:

```html
<script src="path/to/build/admin/admin.build.js"></script>
```

Couple the `concat` task or a `<script>` tag with [grunt-angular-templates][6],
and avoid HTTP requests for your templates.


### RequireJS (AMD)

- Uses [grunt-contrib-requirejs][4].
- Fairly easy to setup.
- Client-side lazy loading of modules.
- Stack trace line numbers matches source.

Simply add the following to your `Gruntfile.js`:

```js
ngmodularize: {
  admin: {
    options: {
      format:   'amd',
      requires: ['admin/admin'],  // Entry-point: `path/to/src/admin/admin.js`
      paths: {
        admin:  '../admin'        // Namespace path: `path/to/src/admin/*`
      }
    },
    src:        'path/to/src/admin/admin.js',
    dest:       'path/to/build/admin/admin.js'
  }
}
```

Now your modules will look like:

```js
define([...], function() {

  ...

});
```

Additionally, alongside your `admin/admin.js`, there will be a RequireJS
`admin/main.js`, which is automatically configured for AngularJS to work
with RequireJS!

Add the following to your `index.html`:

```html
<script data-main="path/to/build/admin/main.js" src="path/to/bower_components/requirejs/require.min.js"></script>
```

Later, when you optimize with `$ grunt ngmodularize requirejs`, your HTML can then have:

```html
<script data-main="path/to/build/admin/main.dist.js" src="path/to/bower_components/requirejs/require.min.js"></script>
```

Notice the `.dist.js` extension?  This is automatically configured in the `requirejs`
target for you!


### Browserify (CommonJS)

- Uses [grunt-browserify][5].
- Fairly easy to setup.
- Requires running `$ grunt browserify` to run in the client.
- Allows usage of NodeJS/CommonJS/NPM packages within application.

Simply add the following to your `Gruntfile.js`:

```js
ngmodularize: {
  admin: {
    options: {
      format:   'cjs',
      paths: {
        admin:  '../admin' // Root path when generating other `require(...)`s
      }
    },
    src:        'path/to/src/admin/admin.js',
    dest:       'path/to/build/admin/admin.js'
  },
}
```

Now, you only need the following in your `index.html`:

```html
<script src="path/to/build/admin/admin.js"></script>
```

Later, when you optimize with `$ grunt ngmodularize browserify`,
your HTML can then have:

```html
<script src="path/to/build/admin/admin.dist.js"></script>
```

Again, the configuration of the `browserify` task has been handled for you
to create a `.dist.js` version.


## Options

*See the [Examples](#examples) for actual use-cases*.


### format

> Module format to convert to

- `amd`: RequireJS (AMD)
- `cjs`: Browserify (CommonJS)


### paths

> Namespaces & their corresponding paths, **relative to the entry-point**

```js
paths: {
  'admin.controllers':  '../admin/ctrls',
  'admin':              '../admin'
}
```

In this example, the module `admin` would expect to be found at `admin/admin.js`,
while `admin.controllers.home` would be found at `admin/ctrls/home.js`.

**Whichever namespace matches the module first wins**.

In the event you don't have an explicit folder for your application
(e.g. everything lives in `/scripts`), then you can use the following:

```js
paths: {
  'admin':  '.'
}
```

In this example, the `admin` modules would be found in `scripts/admin.js`,
while `admin.controllers.home` would be found in `scripts/controllers.home`.

By specifying the root of the `admin` namespace as the current folder (`.`),
the namespace has been effectively nullified.


### requires

> Array of RequireJS paths to require.

You usually only need to put in the web-accessible relative path to the
entry-point of your application.


## Changelog

- v0.1.0 – Initial release

## License

Copyright (c) 2014 Eric Clemmons Licensed under the MIT license.


[1]: http://gruntjs.com/
[2]: https://github.com/ericclemmons/grunt-angular-modularize/tree/master/examples
[3]: https://github.com/gruntjs/grunt-contrib-concat
[4]: https://github.com/gruntjs/grunt-contrib-requirejs
[5]: https://github.com/jmreidy/grunt-browserify
[6]: https://github.com/ericclemmons/grunt-angular-templates
