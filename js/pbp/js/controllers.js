pbpApp.controller('pbpController', ["$scope", "$http", "pbpServices", function($scope, $http, pbpServices) {
    $scope.optionList = pbpServices.productList[0].options;
    $scope.clickOption = function() {
        console.log("You click to li item, hahahah");
    }
}]);
