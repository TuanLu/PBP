pbpApp.controller('pbpFrontendController', ["$scope", "$http", "groupServices", "$location", "$rootScope", function($scope, $http, groupServices, $location, $rootScope) {
    $scope.mediaUrl = $scope.mediaUrl = angular.element(document.querySelector("#mst_media_url")).val() + "pbp/images/";
    $scope.currentGroupId = angular.element(document.querySelector("#current_group_id")).val();
    $scope.group = null;
    //Load ajax only first time
    groupServices.getGroupById($scope.currentGroupId)
    .then(
        function( group ) {
            if(group.status === "success") {
                $scope.group = group.group_data;
            } else {
                console.warn(group.message);
            }
        }
    );
    if(!$rootScope.layerStack) {
        $rootScope.layerStack = {};
    }
    //When add or remove layer in selected layer panel, show that panel only on current group(product)
    $rootScope.currentGroup = null;
    //Remove selected layer event
    $scope.removeSelectedLayer = function(layer) {
        console.info("Remove Selected Layer From $rootScope.layerStack");
        $rootScope.currentGroup = layer.group_id;
        delete $rootScope.layerStack[layer.group_id][layer.id];
        if(!$rootScope.layerStack[layer.group_id] && !$rootScope.layerStack[layer.group_id][layer.id]) {
            $rootScope.showLayer = false;
        }
        //If layer stack of current group empty
        if(angular.equals({}, $rootScope.layerStack[layer.group_id])) {
            $rootScope.showLayer = false;
        }
    }
    //Show selected layer or not
    $rootScope.showLayer = Object.keys($rootScope.layerStack).length;
}]);