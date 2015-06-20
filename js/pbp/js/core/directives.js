// DIRECTIVES
pbpApp.directive("pbpGroup", function() {
    return {
        restrict: 'AE',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/pbpgroup"
        },
        replace: true,
        scope: {
            product: "=",
        }
    }
});
pbpApp.directive("pbpOptionCollection", [function() {
    return {
        restrict: 'AE',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/pbpOptionCollection"
        },
        replace: true,
        scope: {
            optionList: "=",
            level: "@"
        }
    }
}]);
pbpApp.directive("pbpOptionDetails", ["$compile", "pbpServices", "$location", function($compile, pbpServices, $location) {
    //=== LAYER DETAILS CONTROLLER ===//
    layerController.$inject = ["$scope", "pbpServices", "groupServices", "$rootScope"];
    function layerController($scope, pbpServices, groupServices, $rootScope) {
        $scope.mediaUrl = angular.element(document.querySelector("#mst_media_url")).val() + "pbp/images/";
        $scope.expand = true;
        $scope.editLayer = function(layer) {
            console.info("Edit layer func");
            groupServices.currentLayer = layer;
            $location.path("/add-layer/" + layer.id + '/group/' + layer.group_id);
        }
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
            return baseUrl + "productbuilderpro/directives/pbpOptionDetails"
        },
        replace: true,
        scope: {
            optionInfo: "=",
        },
        link: function (scope, element, attrs, controller) {
            //check if this member has children
            if (angular.isArray(scope.optionInfo.options)) {
                // append the collection directive to this element
                //element.append("<pbp-option-collection option-list='optionInfo.options'></pbp-option-collection>");
                // we need to tell angular to render the directive
                //$compile(element.contents())(scope);
                var newMemEL = angular.element("<pbp-option-collection option-list='optionInfo.options'></pbp-option-collection>");
                element.append(newMemEL);
                $compile(newMemEL)(scope);
            }
            /*element.bind("click", function(event) {
                pbpServices.showLog("Child scope click event", "info");
                //Need to run inside $apply function
                scope.$apply(function() {
                   console.log(event.target);
                    pbpServices.currentOption = scope.optionInfo;
                    $location.path("/edit-option");
                });
                event.stop(); //Stop parent event
            });*/
        },
        controller: layerController
    }
}]);
pbpApp.directive("pbpMedia", ["$compile", "pbpServices", function($compile, pbpServices) {
    //=== MEDIA CONTROLLER ===//
    mediaController.$inject = ["$scope", "pbpServices", "groupServices"];
    function mediaController($scope, pbpServices, groupServices) {
        $scope.baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
        $scope.mediaUrl = angular.element(document.querySelector("#mst_media_url")).val() + "pbp/images/";
        //Image list
        $scope.imageList = [
            {
                id: 1,
                filename: 'sample.png',
                name: 'Original Xbox',
            },
            {
                id: 2,
                filename: 'sample.png',
                name: 'Original Ps3',
            },
            {
                id: 3,
                filename: 'sample.png',
                name: 'Microsoft Xbox',
            }
        ];
        $scope.showMedia = false;
        $scope.isUploading = false;
        $scope.imgSrc = '';
        $scope.selectImage = function(element) {
            $scope.showMedia = !$scope.showMedia;
        }
        $scope.chooseImage = function(image, inputName) {
            angular.element(document.querySelector("input[name='"+ inputName +"']")).val(image.filename);
            $scope.showMedia = false;
        }
        $scope.removeImage = function() {
            if(!confirm("Are you sure?")) {
                return false;
            }
            $scope.imgSrc = "";
            $scope.$parent[$scope.name] = "";
        }
        $scope.uploadFile = function(){
            var file = $scope.myFile;
            if(file === undefined) {
                return false;
            }
            $scope.isUploading = true;
            groupServices.uploadImage(file)
            .then(function(response) {
                //Update filename to parent scope
                $scope.$parent[$scope.name] = response.filename;
                $scope.imgSrc = response.filename;
                $scope.isUploading = false;
                //Upload same file once
                $scope.myFile = undefined;
            }, function(error) {
                console.warn(error);
            });
        };
    }
    return {
        restrict: 'AE',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/pbpMedia"
        },
        replace: true,
        link: function ($scope, element, attrs, controller) {
            /*element.bind("click", function(event) {
                if(event.target.src) {
                    var imgSrcSelector = angular.element(document.querySelector(".img-src"));
                    imgSrcSelector.attr("value", event.target.src.split("/pbp/images/")[1]);
                    $scope.showMedia = false;
                    console.log(imgSrcSelector);
                }
                //console.log(event.target);
                //event.stop(); //Stop parent event 
            });*/
        },
        controller: mediaController,
        scope: {
            name: '@',
            imgSrc: '@'
        }
    }
}]);
//==== FILE UPLOAD DIRECTIVE ====//
pbpApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
//==== LOADING DIRECTIVE ====//
pbpApp.directive("pbpLoading", [function() {
    this.media_url = document.getElementById("mst_media_url").value + "pbp/images/";
    return {
        restrict: 'AE',
        template: '<span class="pbp-loading"><img style="width: 30px" src="'+ this.media_url + 'loading.gif"/></span>',
        replace: true
    }
}]);
//==== DOWNLOADING DIRECTIVE ====//
pbpApp.directive("pbpDownloading", [function() {
    this.media_url = document.getElementById("mst_media_url").value + "pbp/images/";
    return {
        restrict: 'AE',
        template: '<span class="pbp-loading"><img style="width: 30px" src="'+ this.media_url + 'downloading.gif"/></span>',
        replace: true
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