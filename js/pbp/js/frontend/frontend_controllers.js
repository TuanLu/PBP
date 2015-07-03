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
        groupServices.createThumbnail($scope.layerStack[$scope.currentGroupId])
        .then(function(response) {
            if(response.status == "success") {
                //Time to add product to cart
                var cartData = {
                    thumbnail_image : response.file_path,
                    selected_layer: $scope.layerStack[$scope.currentGroupId],
                    total_price: $scope.getTotalPrice(),
                    base_product_id: $scope.group.base_product_id
                }
                groupServices.addToCart(cartData)
                .then(function(cartResponse) {
                    if(cartResponse.status == "success") {
                        var cartPageUrl = angular.element("#mst_base_url").val() + "checkout/cart/";
                        window.location = cartPageUrl;
                    } else {
                        console.warn(cartResponse.message);
                    }
                });
            } else {
                console.warn(response.message);
            }
        });
    }
    //======= END ADD TO CART BUTTON ======= //
    
    //Load ajax only first time
    groupServices.getGroupById($scope.currentGroupId)
    .then(
        function( group ) {
            if(group.status === "success") {
                $scope.group = $scope.addSelectionLevel(group.group_data);
                groupServices.initLayerStack($scope.group);
            } else {
                console.warn(group.message);
            }
        }
    );
    $scope.expand = function(layer) {
        angular.element(".accordion-section-content").hide();
        angular.element(".accordion-section-title").removeClass("active");
        angular.element(document.querySelector("#accordion-" + layer.id)).show();
        angular.element("#accordion-arrow-" + layer.id).addClass("active");
        //fadeIn,slideDown,slideToggle
        //layer.expand = !layer.expand;
    }
    /**Root (layer has parent_id = 0) has sub category or just have items only
        Need to check in level 0, for checking in html purpose
        Return a group with new property: selected_level
    **/
    $scope.addSelectionLevel = function(group) {
        if(group.layers) {
            angular.forEach(group.layers, function(childLayer, index) {
                childLayer.selected_level = 1;
                if(childLayer.options) {
                   if(childLayer.options[0].options) {
                        childLayer.selected_level = 2;
                   } 
                }
            });
        }
        return group;
    }
    /**ADD LAYER**/
    $scope.addLayerToDesign = function(layer, rootLayer) {
        //Add layer details
        layer.root_id = rootLayer.id;
        layer.root_title = rootLayer.title;
        layer.root_zindex = rootLayer.zindex;
        groupServices.removeSelectedLayerByRootId(rootLayer.id, $scope.currentGroupId);
        groupServices.layerStack[layer.group_id][layer.id] = layer;
        //Update to services
        groupServices.updateSelectedLayer(groupServices.layerStack);
    }
    // shuffleDesign
    $scope.shuffleDesign = function() {
        groupServices.shuffleLayers($scope.group);
    }
    //Total price
    $scope.getTotalPrice = function() {
        var total = 0;
        if($scope.layerStack && $scope.layerStack[$scope.currentGroupId]) {
            angular.forEach($scope.layerStack[$scope.currentGroupId], function(layer, index) {
                total += parseFloat(layer.price);
            });
        }
        return total.toFixed(2);
    }
}]);