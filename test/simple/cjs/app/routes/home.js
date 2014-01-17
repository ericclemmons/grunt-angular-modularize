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

