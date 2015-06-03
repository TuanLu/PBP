// ROUTES
pbpApp.config(function ($routeProvider) {
    $routeProvider
    
    .when('/', {
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            var defaultUrl = "";
            if (baseUrl !== "") {
                defaultUrl = baseUrl + 'productbuilderpro/index/index';
            }
            return defaultUrl;
        },
        controller: 'pbpController'
    })
    .when('/add_product', {
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            var defaultUrl = "";
            if (baseUrl !== "") {
                defaultUrl = baseUrl + 'productbuilderpro/index/addproduct';
            }
            return defaultUrl;
        },
        controller: 'pbpController'
    })
    .when('/editoption', {
        templateUrl: function() {
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            var defaultUrl = "";
            if (baseUrl !== "") {
                defaultUrl = baseUrl + 'productbuilderpro/index/editoption';
            }
            return defaultUrl;
        },
        controller: 'pbpEditController'
    })
    .otherwise({
        redirectTo: '/'
    });
    
});