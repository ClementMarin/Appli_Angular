(function(angular){
  'use strict';

  angular.module('checkinModule',[])
  .controller('checkinListController', function($scope, $http){
    $scope.ret = false;
    var getCheckList = function(){
      $http({
        method: 'GET',
        url: 'http://checkin-api.dev.cap-liberte.com/checkin'
      }).then(function successCallback(response) {
        $scope.checkins = response.data;
      }, function errorCallback(response) {
      });
    };

    getCheckList();

    $scope.$on('RessourceFinish', function (event) {
      getCheckList();
    });

  })

  .controller('checkinDetailsController', function($routeParams, $scope, $http, $location){
    $http({
      method: 'GET',
      url: 'http://checkin-api.dev.cap-liberte.com/checkin/'+$routeParams.checkinId
    }).then(function successCallback(response) {
      $scope.check = response.data;
      $http({
        method: 'GET',
        url: 'http://api.openweathermap.org/data/2.5/weather?lat='+$scope.check.lat+'&lon='+$scope.check.lng+'&lang=fr&units=metric&appid=39cc5bf3ccdf8207921b7a4413c2f044'
      }).then(function successCallback(response) {
        $scope.weather = response.data;
        var date = new Date($scope.weather.dt*1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        $scope.weather.dt = hours + ':' + minutes.substr(-2);
      }, function errorCallback(response) {
      });
    }, function errorCallback(response) {
    });
    $scope.retour = function () {
      $location.path('');
    };
  })

  .controller('checkinSyncController', function($rootScope, $scope, $http, localStorageService,  notify){
    var self = this;
    var checkIns = localStorageService.get('checkIns');
    if(checkIns!==null && checkIns.length!== 0){
      $scope.nbCheckIns = checkIns.length;
    }
    else {
      $scope.nbCheckIns = 0;
    }
    $scope.$on("nbCheckIns", function(e){
      $scope.nbCheckIns++;
    });

    $scope.post = function () {
      var checkIns = localStorageService.get("checkIns");
      //console.log(checkIns.length);
      angular.forEach(checkIns, function(checkIn){
        $http({
          method: 'POST',
          url: 'http://checkin-api.dev.cap-liberte.com/checkin',
          data:{
            lat: checkIn.lat,
            lng: checkIn.lng
          },
          headers:{
            'Content-Type': undefined
          }
        }).then(function successCallback(response) {
          $scope.check = response.data;
          $scope.loading = false;
          $rootScope.$broadcast('RessourceFinish');
          localStorageService.clearAll("checkIns");
          $scope.nbCheckIns = 0;
          notify({
              message: 'Checkin ajouté avec succès !',
              classes: 'alert-danger',
              position: 'center',
              duration: 4000
            });
        }, function errorCallback(response) {
          $scope.loading = false;
          notify({
              message: "Erreur ajout, vérifiez votre connexion internet !",
              classes: "alert-danger",
              position: "center",
              duration: 4000
            });
        });
      });
    };
  })

  .controller('checkinFormController', function($rootScope, $scope, $http, localStorageService){
    $scope.enable = true;
    $scope.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.$apply(function(){
          $scope.lat = position.coords.latitude;
          $scope.lng = position.coords.longitude;
          $scope.enable = false;
          $scope.loading = false;
        });
      }, function(){
        $scope.enable = false;
        $scope.loading = false;
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    $scope.submit = function () {
      var checkIns = localStorageService.get('checkIns');
      if(checkIns === null){
        checkIns = [];
      }
      var checkIn = {
        lat: $scope.lat,
        lng: $scope.lng
      };

      checkIns.push(checkIn);
      localStorageService.set('checkIns', checkIns);
      $rootScope.$broadcast('nbCheckIns');
    };
  })

  .controller('headerController', function($scope){
    $scope.IsVisible = false;
    $scope.isReturn = false;
    $scope.ajout = "Ajouter un champs";
    $scope.ShowHide = function () {
      if($scope.IsVisible === false){
        $scope.IsVisible = true;
        $scope.ajout = "Fermer l'ajout";
      }
      else{
        $scope.IsVisible = false;
        $scope.ajout = 'Ajouter un champs';
      }
    };
  });
})(window.angular);
