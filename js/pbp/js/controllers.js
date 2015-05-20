pbpApp.controller('pbpController', ["$scope", "$http", "pbpServices", function($scope, $http, pbpServices) {
    $scope.productList = pbpServices.productList;
}]);
