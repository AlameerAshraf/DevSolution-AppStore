var app = angular.module('Feed', []);


app.controller('FeedCtrl', function ($scope, $http) {
    $http.get("http://localhost:1337/Applications")
        .then(function (response) {
            if (response.data != null)
            {
                $scope.names = response.data;
            }
            console.log(response.data)
        });
});