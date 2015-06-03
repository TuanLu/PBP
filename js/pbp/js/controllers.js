pbpApp.controller('pbpController', ["$scope", "$http", "pbpServices", function($scope, $http, pbpServices) {
    $scope.optionList = pbpServices.productList[0].options;
    $scope.editOption = function(option) {
        //console.log("You click to li item, hahahah");
        //console.log(option);
    }
}]);
//==== EDIT Controller ====//
pbpApp.controller('pbpEditController', ["$scope", "$http", "pbpServices", "$location", function($scope, $http, pbpServices, $location) {
    $scope.currentOption = pbpServices.currentOption;
    if(!$scope.currentOption) {
        //Redirect to index page
        $location.path("/");
    }
}]);
