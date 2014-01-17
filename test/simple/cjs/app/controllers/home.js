
module.exports = angular
  .module('app.controllers.home', [])
  .controller('HomeController', [
    '$scope',
    function($scope) {
      $scope.message = 'Welcome Home!';
    }
  ])
;

