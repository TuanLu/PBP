pbpApp.controller('pbpController', ["$scope", "$http", "pbpServices", function($scope, $http, pbpServices) {
    $scope.optionList = pbpServices.productList[0].options;
    $scope.editOption = function(option) {
        //console.log("You click to li item, hahahah");
        //console.log(option);
    }
}]);
