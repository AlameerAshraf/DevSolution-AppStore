var Main = angular.module('Main', ['ngRoute']);

Main.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/HomeView', {
            templateUrl: '/HomeView.html',
            controller : 'HomeController'
        })
    $locationProvider.hashPrefix('');
});


    
Main.controller('HomeController', function ($scope) {
    console.log("as");
});