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
pbpApp.directive("pbpMedia", ["$compile", "pbpServices", "$location", function($compile, pbpServices, $location) {
    return {
        restrict: 'AE',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/pbpMedia"
        },
        replace: true,
        scope: {
            
        },
        link: function (scope, element, attrs, controller) {
            element.bind("click", function(event) {
                if(event.target.src) {
                    var imgSrcSelector = angular.element(document.querySelector(".img-src"));
                    console.log(imgSrcSelector);
                    imgSrcSelector.attr("value", event.target.src);
                }
                //event.stop(); //Stop parent event
                
            });
        }
    }
}]);