// DIRECTIVES
pbpApp.directive("pbpLayerCollection", [function() {
    return {
        restrict: 'AE',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/pbpLayerCollection"
        },
        replace: true,
        scope: {
            optionList: "=",
            level: "@"
        }
    }
}]);
pbpApp.directive("pbpLayerDetails", ["$compile", "pbpServices", "$location", function($compile, pbpServices, $location) {
    //=== LAYER DETAILS CONTROLLER ===//
    layerController.$inject = ["$scope", "pbpServices", "groupServices", "$rootScope"];
    function layerController($scope, pbpServices, groupServices, $rootScope) {
        $scope.mediaUrl = angular.element(document.querySelector("#mst_media_url")).val() + "pbp/images/";
        $scope.expand = false;
        $scope.expandLayer = function(layer) {
            $scope.expand = !$scope.expand;
            angular.element(document.querySelector("#layer_" + layer.id + " ul")).toggleClass("ng-hide");
        }
        $scope.removeLayer = function(layer) {
            console.info("Remove layer");
            if(!confirm("Are you really want to delete this layer?")) {
                return false;
            }
            groupServices.removeLayer(layer)
            .then(function(response) {
                groupServices.updateGroupData(response);
            }, function(error) {
                console.warn(error);
            });
        }
        $scope.addLayerToDesign = function(layer) {
            console.info("Add Layer To Design");
            //First time load, layerStack == null
            groupServices.currentGroupId = layer.group_id;
            if(!groupServices.layerStack) {
                groupServices.layerStack = {};
            }
            if(!groupServices.layerStack[layer.group_id]) {
                groupServices.layerStack[layer.group_id] = {};
            }
            //Get group info
            $scope.currentGroupLayers = null;
            angular.forEach(groupServices.groups, function(group, index) {
                if(group.id === layer.group_id) {
                    $scope.currentGroupLayers = group.layers || null;
                    return false;
                }
            });
            //console.log(groupServices.groups);
            if($scope.currentGroupLayers) {
                angular.forEach($scope.currentGroupLayers, function(layerInGroup, index) {
                    if(layer.parent_id === layerInGroup.id) {
                        // 1 is single select
                        // Remove the object have same parent id before add new object to stack
                        if(layerInGroup.select_type === "1") {
                            angular.forEach(groupServices.layerStack[layer.group_id], function(layerInStack, index) {
                                if(layerInStack.parent_id === layerInGroup.id) {
                                    delete groupServices.layerStack[layer.group_id][layerInStack.id];
                                }
                            });
                        }
                    }
                });
            }
            //groupServices.layerStack[layer.group_id][layer.id] = layer;
            groupServices.layerStack[layer.group_id][layer.id] = layer;
            groupServices.updateSelectedLayer(groupServices.layerStack);
        }
    }
    return {
        restrict: 'AE',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/pbpLayerDetails"
        },
        replace: true,
        scope: {
            optionInfo: "=",
        },
        link: function (scope, element, attrs, controller) {
            //check if this member has children
            if (angular.isArray(scope.optionInfo.options)) {
                var newMemEL = angular.element("<pbp-layer-collection option-list='optionInfo.options'></pbp-layer-collection>");
                element.append(newMemEL);
                $compile(newMemEL)(scope);
            }
        },
        controller: layerController
    }
}]);
//==== SELECTED LAYER ====//
pbpApp.directive("selectedLayer", ["$compile", "pbpServices", "$rootScope", function($compile, pbpServices, $rootScope) {
   //=== SELECTED LAYER CONTROLLER ===//
    selectedLayer.$inject = ["$scope", "pbpServices", "groupServices", "$rootScope"];
    function selectedLayer($scope, pbpServices, groupServices, $rootScope) {
        $scope.baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
        $scope.mediaUrl = angular.element(document.querySelector("#mst_media_url")).val() + "pbp/images/";
        $scope.getTotalPrice = function(selectedLayers) {
            var total = 0;
            if(selectedLayers) {
                angular.forEach(selectedLayers, function(layer, index) {
                    total += parseFloat(layer.price);
                });
            }
            return total.toFixed(2);
        }
        $scope.showLayer = function(stackLayer) {
            if(angular.equals({}, stackLayer) || !stackLayer) {
                return false;
            }
            return true;
        }
        $scope.removeSelectedLayer = function(layer) {
            groupServices.currentGroupId = layer.group_id;
            delete groupServices.layerStack[layer.group_id][layer.id];
            //Update layerStack via services
            groupServices.updateSelectedLayer(groupServices.layerStack);
        }
    }
    return {
        restrict: 'AE',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/selectedLayer"
        },
        replace: true,
        link: function ($scope, element, attrs, controller) {
            
        },
        scope: {
            groupId : "@",
            layerStack: "=",
            reloadPrice: "&"
        },
        controller: selectedLayer,
    }
}]);