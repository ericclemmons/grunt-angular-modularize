(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./routes/home');

module.exports = angular
  .module('app', [
    'chieffancypants.loadingBar',
    'app.routes.home'
  ])
;


},{"./routes/home":3}],2:[function(require,module,exports){

module.exports = angular
  .module('app.controllers.home', [])
  .controller('HomeController', [
    '$scope',
    function($scope) {
      $scope.message = 'Welcome Home!';
    }
  ])
;


},{}],3:[function(require,module,exports){
require('../controllers/home');

module.exports = angular
  .module('app.routes.home', [
    'app.controllers.home',
    'ui.router'
  ])
  .config([
    '$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('home', {
          controller:   'HomeController',
          templateUrl:  'app/templates/home.html',
          url:          ''
        })
      ;
    }
  ])
;


},{"../controllers/home":2}]},{},[1])