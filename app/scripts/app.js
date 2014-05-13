'use strict';

angular
  .module('javascriptApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'pouchdb'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
