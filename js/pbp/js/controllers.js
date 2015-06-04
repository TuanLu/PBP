//==== Group Controller ====//
pbpApp.controller('pbpController', ["$scope", "$http", "groupServices", "$location", function($scope, $http, groupServices, $location) {
    //Group list
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
    //Remove group
    $scope.removeGroup = function(group) {
        groupServices.removeGroup(group)
        .then(function(response) {
            $scope.groups = response;
        }, function(error) {
            console.warn(error);
        });
    }
}]);
//=== ADD group controller ===//
pbpApp.controller('addGroupController', ["$scope", "groupServices", "$location", function($scope, groupServices, $location) {
    $scope.groupData = {
        id: 0,
        title: 'Unknow',
        base_product_id : '',
        description: 'Defaut description',
        status: '1',
    }
    $scope.saveGroup = function() {
        groupServices.addGroup($scope.groupData)
        .then(function(response) {
            $location.path('/');
        }, function(error) {
            console.warn(error);
        });
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
