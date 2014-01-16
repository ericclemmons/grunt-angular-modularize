require('../app/routes/home');

module.exports = angular
  .module('app', [
    'chieffancypants.loadingBar',
    'app.routes.home'
  ])
;

