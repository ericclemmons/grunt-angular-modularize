window.name = "NG_DEFER_BOOTSTRAP!";

require.config({
  paths: {
    "app": "../app"
  }
});

require([
  "app/app"
], function() {
  angular.element().ready(function() {
    angular.resumeBootstrap([
      "app",
      "app.routes.home",
      "app.controllers.home"
    ]);
  });
});
