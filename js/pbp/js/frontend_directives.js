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
        $scope.expand = true;
        $scope.expandLayer = function(layer) {
            $scope.expand = !$scope.expand;
            angular.element(document.querySelector("#layer_" + layer.id + " ul")).toggleClass("ng-hide");
        }
        $scope.addLayerToDesign = function(layer) {
            console.info("Add Layer To Design");
            $rootScope.currentGroup = layer.group_id;
            if(!$rootScope.layerStack[layer.group_id]) {
                $rootScope.layerStack[layer.group_id] = {};
            }
            $rootScope.layerStack[layer.group_id][layer.id] = layer;
            $rootScope.showLayer = Object.keys($rootScope.layerStack[layer.group_id]).length || false;
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
    //=== MEDIA CONTROLLER ===//
    selectedLayer.$inject = ["$scope", "pbpServices", "groupServices", "$rootScope"];
    function selectedLayer($scope, pbpServices, groupServices, $rootScope) {
        $scope.baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
        $scope.mediaUrl = angular.element(document.querySelector("#mst_media_url")).val() + "pbp/images/";
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
        controller: selectedLayer,
    }
}]);