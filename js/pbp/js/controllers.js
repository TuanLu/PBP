pbpApp.controller('pbpController', ["$scope", "$http", "groupServices", function($scope, $http, groupServices) {
    //$scope.optionList = pbpServices.productList[0].options;
    //Get pbp groups
    $scope.groups = [];
    function loadRemoteGroups() {
        // The groupServices returns a promise.
        groupServices.getGroups()
        .then(
            function( groups ) {
                applyRemoteGroupData(groups);
            }
        );
    }
    function applyRemoteGroupData( newGroups ) { 
        $scope.groups = newGroups;
    }
    loadRemoteGroups();
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

