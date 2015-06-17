//==== Group Controller ====//
pbpApp.controller('pbpController', ["$scope", "$http", "groupServices", "$location", "$rootScope", function($scope, $http, groupServices, $location, $rootScope) {
    //Group list
    $scope.groups = [];
    //Load ajax only first time
    if(groupServices.groups == null) {
        // The groupServices returns a promise.
        groupServices.getGroups()
        .then(
            function( groups ) {
                 $scope.groups = groups;
            }
        );
    } else {
        $scope.groups = groupServices.groups;
    }
    //Update groups in service when scope change
    $scope.$watch("groups", function() {
        groupServices.groups = $scope.groups;
    });
    //Remove group
    $scope.removeGroup = function(group) {
        if(!confirm("Are you really want to delete this product?")) {
            return false;
        }
        groupServices.removeGroup(group)
        .then(function(response) {
            $scope.groups = response;
        }, function(error) {
            console.warn(error);
        });
    }
    //Update groups whenever groupServices.groups change
    $scope.$on('handleUpdateGroups', function() {
        $scope.groups = groupServices.groups;
    });
    // Used layer using $rootScope
    $scope.mediaUrl = angular.element(document.querySelector("#mst_media_url")).val() + "pbp/images/";
    console.log("Used Layer");
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
//=== ADD group controller ===//
pbpApp.controller('addGroupController', ["$scope", "groupServices", "$location", "$routeParams", function($scope, groupServices, $location, $routeParams) {
    $scope.id = $routeParams.id;
    $scope.groupData = {
        id: 0,
        title: '',
        base_product_id : '',
        description: '',
        status: '1',
    }
    if($scope.id != 0) {
        //Try to get group info from groupServices
        if(!groupServices.groups) {
            $location.path("/");
        }
        angular.forEach(groupServices.groups, function(group, index) {
            if(group.id == $scope.id) {
                $scope.groupData = group;
            }
        });
    }
    $scope.resetGroupData = function() {
        $scope.groupData = {
            id: 0,
            title: '',
            base_product_id : '',
            description: '',
            status: '1',
        }
    }
    $scope.isSaving = false;
    $scope.saveGroup = function() {
        if(!$scope.validForm()) {
            return false;
        }
        $scope.isSaving = true;
        groupServices.addGroup($scope.groupData)
        .then(function(response) {
            groupServices.groups = response;
            $scope.resetGroupData();
            $scope.isSaving = false;
            $location.path('/');
        }, function(error) {
            console.warn(error);
        });
    }
    //Validate group form
    $scope.validForm = function() {
        if(!$scope.groupData.title || !$scope.groupData.base_product_id) {
            return false;
        }
        return true;
    }
    //Embed code
    $scope.embedCode = {
        staticBlock : '{{block type="core/template" name="pbp_group_'+ $scope.id +'" group_id="'+ $scope.id +'" template="productbuilderpro/productbuilderpro.phtml" }}',
    }
}]);
//==== ADD LAYER ====//
pbpApp.controller('addLayerController', ["$scope", "groupServices", "$location", "$routeParams", function($scope, groupServices, $location, $routeParams) {
    $scope.groups = [];
    $scope.parents = [];
    $scope.id = $routeParams.id;
    //If admin reload add layer page, redirect to main page
    if($scope.id !== '0' && groupServices.currentLayer === null) {
        $location.path("/");
        return;
    }
    //Load ajax only first time
    if(groupServices.groups === null) {
        // The groupServices returns a promise.
        groupServices.getGroups()
        .then(
            function( groups ) {
                $scope.groups = groups;
                groupServices.groups = $scope.groups;
            }
        );
    } else {
        $scope.groups = groupServices.groups;
    }
    //Load parents same as group
    if(groupServices.parents === null) {
        // The groupServices returns a promise.
        groupServices.getLayerParents()
        .then(
            function( parents ) {
                $scope.parents = parents;
                groupServices.parents = $scope.parents;
                // Selected option after asynchronously 
                angular.forEach($scope.parents, function(parent, index) {
                    if(parent.id == $scope.layerData.parent_id) {
                        $scope.selectedParent = parent;
                        return false;
                    }
                });
            }
        );
    } else {
        $scope.parents = groupServices.parents;
        // Selected option after synchronously 
        angular.forEach($scope.parents, function(parent, index) {
            if(parent.id == groupServices.currentLayer.parent_id) {
                $scope.selectedParent = parent;
                return false;
            }
        });
    }
    // Use pdp-media directive
    $scope.thumbnail_image = (groupServices.currentLayer) ? groupServices.currentLayer.thumbnail_image : '';
    $scope.main_image = (groupServices.currentLayer) ? groupServices.currentLayer.main_image : '';
    $scope.layerData = {
        id: 0,
        title: '',
        parent_id: 0,
        group_id: '',
        description: '',
        thumbnail_image: $scope.thumbnail_image,
        main_image: $scope.main_image,
        price: 0,
        position: 0,
        is_required: '2',
        status: '1',
    }
    if($scope.id !== '0' && groupServices.currentLayer) {
        $scope.layerData = groupServices.currentLayer;
    } else {
        //Reset $scope.layerData
        $scope.layerData = {
            id: 0,
            title: '',
            parent_id: 0,
            group_id: '',
            description: '',
            thumbnail_image: $scope.thumbnail_image,
            main_image: $scope.main_image,
            price: 0,
            position: 0,
            is_required: 2,
            status: 1,
            select_type: 1,
        }
    }
    // Binding data from child scope
    $scope.$watch("thumbnail_image", function() {
        $scope.layerData.thumbnail_image = $scope.thumbnail_image;
    });
    $scope.$watch("main_image", function() {
        $scope.layerData.main_image = $scope.main_image;
    });
    //Save layer function
    $scope.isSaving = false;
    $scope.saveLayer = function() {
        if(!$scope.validForm()) {
            return false;
        }
        $scope.isSaving = true;
        groupServices.addLayer($scope.layerData)
        .then(function(response) {
            try {
                //Reset the form 
                document.getElementById("add_new_group_form").reset();
                //$scope.parents = response.parents;
                groupServices.parents = response.parents;
                groupServices.groups = response.groups;
                //Redirect to index page
                $location.path("/");
            } catch(error) {
                console.log(error);
            }
            $scope.isSaving = false;
        }, function(error) {
            console.warn(error);
        });
    }
    //Validate form
    $scope.validForm = function() {
        if(!$scope.layerData.title || !$scope.layerData.group_id || !$scope.layerData.parent_id) {
            return false;
        }
        return true;
    }
}]);
