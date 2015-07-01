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
    //Add layer for group
    $scope.addLayerForGroup = function(group) {
        $location.path("/add-layer/0/group/" + group.id);
    }
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
    //======= SELECTED LAYER ======= //
    $scope.layerStack = groupServices.layerStack;
    //Update layer stack whenever groupServices.layerStack change
    //Need to track layerStack cause add and remove in different directive
    $scope.$on('handleUpdateLayerStack', function() {
        $scope.layerStack = groupServices.layerStack;
        $scope.currentGroupId = groupServices.currentGroupId
    });
    // Used layer using $rootScope
    $scope.mediaUrl = angular.element(document.querySelector("#mst_media_url")).val() + "pbp/images/";
    //======= END SELECTED LAYER ======= //
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
    $scope.groupId = $routeParams.groupid;
    $scope.initLayerData = function() {
        //Reset $scope.layerData
        $scope.layerData = {
            id: '0',
            title: '',
            parent_id: '0',
            group_id: $scope.groupId,
            description: '',
            thumbnail_image: $scope.thumbnail_image,
            main_image: $scope.main_image,
            price: '0',
            position: '0',
            is_required: '2',
            status: '1',
            select_type: '1',
            independence: [],
            zindex: 0
        }
    }
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
                /*angular.forEach($scope.parents, function(parent, index) {
                    if(parent.id == $scope.layerData.parent_id) {
                        $scope.selectedParent = parent;
                        return false;
                    }
                });*/
            }
        );
    } else {
        $scope.parents = groupServices.parents;
        // Selected option after synchronously 
        /*angular.forEach($scope.parents, function(parent, index) {
            if(parent.id == groupServices.currentLayer.parent_id) {
                $scope.selectedParent = parent;
                return false;
            }
        });*/
    }
    // Use pdp-media directive
    $scope.thumbnail_image = (groupServices.currentLayer) ? groupServices.currentLayer.thumbnail_image : '';
    $scope.main_image = (groupServices.currentLayer) ? groupServices.currentLayer.main_image : '';
    $scope.initLayerData();
    if($scope.id !== '0' && groupServices.currentLayer) {
        $scope.layerData = groupServices.currentLayer;
        //Convert independence to array if not null. Edit Action
        if($scope.layerData.independence && angular.isString($scope.layerData.independence)) {
            $scope.layerData.independence = $scope.layerData.independence.split(",");
        } else if(!$scope.layerData.independence) {
            $scope.layerData.independence = [];
        }
    } else {
        $scope.initLayerData();
    }
    $scope.backOrCancel = function() {
        groupServices.currentLayer = null;
        $location.path("/");
    }
    // Binding data from child scope
    $scope.$watch("thumbnail_image", function() {
        $scope.layerData.thumbnail_image = $scope.thumbnail_image;
    });
    $scope.$watch("main_image", function() {
        $scope.layerData.main_image = $scope.main_image;
    });
    /*$scope.$watch("independence", function() {
        $scope.layerData.independence = $scope.independence.join();
    });*/
    //Save layer function
    $scope.isSaving = false;
    $scope.saveLayer = function() {
        if(!$scope.validForm()) {
            return false;
        }
        $scope.isSaving = true;
        //Convert independence from array to string
        groupServices.addLayer($scope.layerData)
        .then(function(response) {
            try {
                if(response.status == "error") {
                    alert(response.message);
                    $scope.isSaving = false;
                    return false;
                }
                //Reset the form 
                document.getElementById("add_new_group_form").reset();
                //$scope.parents = response.parents;
                groupServices.parents = response.parents;
                groupServices.groups = response.groups;
                //Redirect to index page
                $scope.backOrCancel();
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
    //============== independency ===================
    //groupServices.currentLayer.independence might return null
    $scope.selectIndependence = function(parent) {
        if($scope.layerData.independence.indexOf(parent.id) == -1) {
            $scope.layerData.independence.push(parent.id);
        } else {
            //Remove this item from array
            $scope.layerData.independence.splice($scope.layerData.independence.indexOf(parent.id), 1);
        }
    }
    $scope.isSelected = function(parentId) {
        if(angular.isArray($scope.layerData.independence) 
           && $scope.layerData.independence.indexOf(parentId) == -1) {
            return false;
        }
        return true;
    }
    $scope.openIndependence = false;
    $scope.openIndependenceList = function() {
        $scope.openIndependence = !$scope.openIndependence;
    }
    //============== END independency ===================
    
    //======= MEDIA MODEL ==============//
    $scope.libraryImages = groupServices.libraryImages;
    if($scope.libraryImages == null) {
        // The groupServices returns a promise.
        groupServices.getLibraryImages()
        .then(
            function( images ) {
                 $scope.libraryImages = images;
            }
        );
    }
    //Update groups in service when scope change
    $scope.$watch("libraryImages", function() {
        groupServices.libraryImages = $scope.libraryImages;
    });
    //======= END MEDIA MODEL ==========//
}]);
