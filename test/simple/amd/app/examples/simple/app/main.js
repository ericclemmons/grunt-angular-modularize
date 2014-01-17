window.name = "NG_DEFER_BOOTSTRAP!";

require.config({
  paths: {
    "app": "../app",
    "main": "examples/simple/app"
  }
});

require([
  "app/bootstrap"
], function() {
  angular.element().ready(function() {
    angular.resumeBootstrap([
      "app",
      "app.routes.home",
      "app.controllers.home"
    ]);
  });
});
