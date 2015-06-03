// ROUTES
pbpApp.config(function ($routeProvider) {
    $routeProvider
    
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
    .when('/test', {
        template: '<h1>Test Router</h1>',
        controller: 'pbpController'
    })
    .otherwise({
        redirectTo: '/'
    });
    
});