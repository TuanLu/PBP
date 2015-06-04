pbpApp.controller('pbpController', ["$scope", "$http", "pbpServices", function($scope, $http, pbpServices) {
    $scope.optionList = pbpServices.productList[0].options;
    //Get pbp groups
    $scope.pbpGroups = null;
    var getGroupUrl = pbpServices.base_url + "productbuilderpro/main/getgroup";
    $http.post(getGroupUrl, null).
    success(function(data, status, headers, config) {
        if(data) {
            $scope.pbpGroups = data;
        }
    }).
    error(function(data, status, headers, config) {
        pbpServices.showLog("Something went wrong!", "warn");
    });
    
}]);
//==== EDIT Controller ====//
pbpApp.controller('pbpEditController', ["$scope", "$http", "pbpServices", "$location", function($scope, $http, pbpServices, $location) {
    $scope.currentOption = pbpServices.currentOption;
    if(!$scope.currentOption) {
        //Redirect to index page
        $location.path("/");
    }
}]);
//==== Add Layer Controller ====//
pbpApp.controller('pbpAddLayerController', ["$scope", "$http", "pbpServices", "$location", function($scope, $http, pbpServices, $location) {
    $scope.title = '';
    $scope.base_product_id = 0;
    $scope.groupData = {
        id: 0,
        title: 'Unknow',
        base_product_id : '',
        description: 'Defaut description',
        status: '1',
        
    }
    $scope.saveGroup = function() {
        pbpServices.saveGroup($scope.groupData);
    }
}]);

