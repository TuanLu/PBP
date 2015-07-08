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
        //Item states
        $scope.expand = false;
        $scope.isSelected = false;
        $scope.expandLayer = function(layer) {
            $scope.expand = !$scope.expand;
            angular.element(document.querySelector("#layer_" + layer.id + " ul")).toggleClass("ng-hide");
        }
        $scope.addLayerToDesign = function(layer) {
            $scope.isSelected = !$scope.isSelected;
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
            //Toggle select layer or unselect
            if(!$scope.isSelected) {
                if(groupServices.layerStack[layer.group_id]) {
                    angular.forEach(groupServices.layerStack[layer.group_id], function(layerInStack, index) {
                        if(angular.equals(layer, layerInStack)) {
                            delete groupServices.layerStack[layer.group_id][layerInStack.id];
                            return;
                        }
                    });
                }
            } else {
                groupServices.layerStack[layer.group_id][layer.id] = layer;
            }
            //Update to services
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
            //Try to access scope of li item via DOM selector
            var liScope = angular.element(document.querySelector("#layer_" + layer.id)).scope();
            //Remove left layer selected status when remove layer from layer panel 
            liScope.$$childHead.isSelected = false;
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
//==== LOADING DIRECTIVE ====//
pbpApp.directive("pbpLoading", [function() {
    this.media_url = document.getElementById("mst_media_url").value + "pbp/images/";
    return {
        restrict: 'AE',
        template: '<span class="pbp-loading"><img style="margin: 5px auto;" src="'+ this.media_url + 'loading2.gif"/></span>',
        replace: true
    }
}]);