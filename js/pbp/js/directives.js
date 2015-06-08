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
            editOption: "&"
        }
    }
}]);
pbpApp.directive("pbpOptionDetails", ["$compile", "pbpServices", "$location", function($compile, pbpServices, $location) {
    return {
        restrict: 'AE',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/pbpOptionDetails"
        },
        replace: true,
        scope: {
            optionInfo: "=",
            editOption: "&"
        },
        link: function (scope, element, attrs, controller) {
            //check if this member has children
            if (angular.isArray(scope.optionInfo.options)) {
                // append the collection directive to this element
                element.append("<pbp-option-collection option-list='optionInfo.options' edit-option='editOption(option)'></pbp-option-collection>");
                // we need to tell angular to render the directive
                $compile(element.contents())(scope);
            }
            element.bind("click", function(event) {
                pbpServices.showLog("Child scope click event", "info");
                //Need to run inside $apply function
                scope.$apply(function() {
                    pbpServices.currentOption = scope.optionInfo;
                    $location.path("/edit-option");
                });
                event.stop(); //Stop parent event
            });
        }
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