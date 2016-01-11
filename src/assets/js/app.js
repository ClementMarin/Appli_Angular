(function(angular){
  'use strict';

  angular.module('myApp', [
    'ngRoute', 'ngMap', 'cgNotify',
    'checkinModule', 'LocalStorageModule'
  ])

  .config(function($routeProvider){
      $routeProvider
        .when('/', {
          templateUrl: 'assets/template/checkinList.html',
          controller: 'checkinListController'
        })
        .when('/checkin/:checkinId',{
          templateUrl: 'assets/template/checkinDetails.html',
          controller: 'checkinDetailsController'
        });
  });

})(window.angular);
