(function(angular){
  'use strict';

  angular.module('myApp', [
    'ngRoute', 'ngMap', 'cgNotify', 'satellizer',
    'checkinModule', 'loginModule', 'LocalStorageModule'
    ])

  .config(function($routeProvider, $authProvider){
    $routeProvider
    .when('/login', {
      templateUrl: 'assets/template/login.html',
      controller: 'LoginController'
    })
    .when('/', {
      templateUrl: 'assets/template/checkinList.html',
      controller: 'checkinListController'
    })
    .when('/checkin/:checkinId',{
      templateUrl: 'assets/template/checkinDetails.html',
      controller: 'checkinDetailsController'
    });

    $authProvider.httpInterceptor = function() { return true; },
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
    $authProvider.cordova = false;
    $authProvider.baseUrl = 'http://checkin-api.dev.cap-liberte.com/';
    $authProvider.loginUrl = '/auth';
    $authProvider.signupUrl = '/auth/signup';
    $authProvider.unlinkUrl = '/auth/unlink/';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = 'satellizer';
    $authProvider.authHeader = 'Authorization';
    $authProvider.authToken = 'Bearer';
    $authProvider.storageType = 'localStorage';

    // Facebook
    $authProvider.facebook({
      name: 'facebook',
      url: '/auth/facebook/',
      authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
      redirectUri: window.location.origin + '/auth/facebook/facebook/callback',
      requiredUrlParams: ['display', 'scope', 'appId'],
      appId: '1580533328935514',
      scope: ['email'],
      scopeDelimiter: ',',
      display: 'popup',
      type: '2.0',
      popupOptions: { width: 580, height: 400 }
    });
    
    // Google
    $authProvider.google({
      url: '/auth/google',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      redirectUri: window.location.origin + '/auth/facebook/google/callback',
      requiredUrlParams: ['scope', 'client_id'],
      optionalUrlParams: ['display'],
      client_id: '974568352136-of54g4234aeat1fmu6eudq4blqema56f.apps.googleusercontent.com',
      scope: ['profile', 'email'],
      scopePrefix: 'openid',
      scopeDelimiter: ' ',
      display: 'popup',
      type: '2.0',
      popupOptions: { width: 452, height: 633 }
    });
    
    // Twitter
    $authProvider.twitter({
      url: '/auth/twitter',
      authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
      redirectUri: window.location.origin + '/auth/facebook/twitter/callback',
      type: '2.0',
      popupOptions: { width: 495, height: 645 }
    });
  });

})(window.angular);
