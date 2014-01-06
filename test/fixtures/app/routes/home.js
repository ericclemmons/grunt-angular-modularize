angular
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
          templateUrl:  'admin/templates/home.html',
          url:          '/'
        })
    }
  ])
;
