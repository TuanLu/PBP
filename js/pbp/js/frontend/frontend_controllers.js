pbpApp.controller('pbpFrontendController', ["$scope", "$http", "groupServices", "$location", "$rootScope", function($scope, $http, groupServices, $location, $rootScope) {
    $scope.mediaUrl = $scope.mediaUrl = angular.element(document.querySelector("#mst_media_url")).val() + "pbp/images/";
    $scope.currentGroupId = angular.element(document.querySelector("#current_group_id")).val();
    $scope.group = null;
    //======= SELECTED LAYER ======= //
    $scope.layerStack = groupServices.layerStack;
    //Update layer stack whenever groupServices.layerStack change
    //Need to track layerStack cause add and remove in different directive
    $scope.$on('handleUpdateLayerStack', function() {
        $scope.layerStack = groupServices.layerStack;
        console.info("handleUpdateLayerStack called. layerStack changed!");
        $scope.currentGroupId = groupServices.currentGroupId
    });
    
    //======= END SELECTED LAYER ======= //
    
    //======= ADD TO CART BUTTON ======= //
    //Show or hide add to cart button
    $scope.showAddToCartBtn = function(stackLayer) {
        if(angular.equals({}, stackLayer) || !stackLayer) {
            return false;
        }
        return true;
    }
    $scope.addToCart = function() {
        console.info("Prepare add design to cart");
        console.info(JSON.stringify($scope.layerStack[$scope.currentGroupId]));
    }
    //======= END ADD TO CART BUTTON ======= //
    
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
}]);