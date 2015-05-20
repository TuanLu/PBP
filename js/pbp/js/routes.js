// ROUTES
pbpApp.config(function ($routeProvider) {
    $routeProvider
    
    .when('/add_product', {
        templateUrl: function() {
            console.log(window);
            var baseUrl = angular.element(document.querySelector("#mst_base_url")).val();
            var defaultUrl = "";
            if (baseUrl !== "") {
                defaultUrl = baseUrl + 'productbuilderpro/index/addproduct';
            }
            return defaultUrl;
        },
        controller: 'pbpController'
    })
    .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })
    .otherwise({
        redirectTo: '/'
    });
    
});