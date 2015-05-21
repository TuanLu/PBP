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
pbpApp.directive("pbpOptionCollection", function() {
    return {
        restrict: 'AE',
        require: '^pbpOptionDetails',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/pbpOptionCollection"
        },
        replace: true,
        scope: {
            optionList: "=",
            clickOption: "&"
        }
    }
});
pbpApp.directive("pbpOptionDetails", function($compile) {
    return {
        restrict: 'AE',
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            return baseUrl + "productbuilderpro/directives/pbpOptionDetails"
        },
        replace: true,
        scope: {
            optionInfo: "=",
            clickOption: "&"
        },
        link: function (scope, element, attrs) {
            //check if this member has children
            if (angular.isArray(scope.optionInfo.options)) {
                // append the collection directive to this element
                element.append("<pbp-option-collection option-list='optionInfo.options'></pbp-option-collection>");
                // we need to tell angular to render the directive
                $compile(element.contents())(scope);
            }
        }
    }
});