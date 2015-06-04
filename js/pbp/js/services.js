pbpApp.service("groupServices", ["$http", "$q", function($http, $q) {
    var self = this;
    this.base_url = document.getElementById("mst_base_url").value;
    // Return public API.
    return({
        addGroup: addGroup,
        getGroups: getGroups,
        removeGroup: removeGroup
    });
    //Public method
    function addGroup( groupData ) {
        var request = $http({
            method: "post",
            url: self.base_url + "productbuilderpro/main/savegroup",
            params: {
                action: "add"
            },
            data: groupData
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function getGroups() {
        var request = $http({
            method: "get",
            url: self.base_url + "productbuilderpro/main/getgroup",
            params: {
                action: "get"
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function removeGroup(group) {
        var request = $http({
            method: "delete",
            url: self.base_url + "productbuilderpro/main/removegroup",
            params: {
                action: "delete"
            },
            data: {
                id: group.id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
    // ---
    // PRIVATE METHODS.
    // ---
    function handleError( response ) {
        if (! angular.isObject( response.data ) ||! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }
        // Otherwise, use expected error message.
        return( $q.reject( response.data.message ) );
    }
    // transform the successful response, unwrapping the application data
    // from the API response payload.
    function handleSuccess( response ) {
        return( response.data );
    }
}]);
pbpApp.service("pbpServices", ["$http", function($http) {
    var self = this;
    this.base_url = document.getElementById("mst_base_url").value;
    this.isShowLog = true;
    this.currentOption = null;
    //Hold all customized product(group)
    this.pbpGroups = null;
    this.productList = [
        {
            id: 1,
            name: "Play staytion 3",
            original_image: "http://localhost/github/pbp/media/pbp/images/main/original_ps3.png",
            options: [
                {
                    id: 3,
                    title: " Option 1",
                    thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/thumbnail.jpg",
                    main_image: "http://localhost/github/pbp/media/pbp/images/main/ps3.png",
                    options: [
                        {
                            id: 4,
                            title: "Option 1.1",
                            thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/btn_thumb.png",
                            main_image: "http://localhost/github/pbp/media/pbp/images/main/original_xbox.png",
                        },
                        {
                            id: 5,
                            title: "Option 1.2",
                            thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/btn_thumb.png",
                            main_image: "http://localhost/github/pbp/media/pbp/images/main/main_button.png",
                        },
                        {
                            id: 6,
                            title: "Option 1.3",
                            thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/btn_thumb.png",
                            main_image: "http://localhost/github/pbp/media/pbp/images/main/button.png",
                            options: [
                                {
                                    id: 7,
                                    title: "Option 1.3.1",
                                    thumbnail: "",
                                    main_image: ""
                                },
                                {
                                    id: 8,
                                    title: "Option 1.3.2",
                                    thumbnail: "",
                                    main_image: ""
                                },
                            ]
                        }
                    ]
                },
                {
                    id: 9,
                    title: " Option 2",
                    thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/btn_thumb.png",
                    main_image: "http://localhost/github/pbp/media/pbp/images/main/button.png"
                }
            ]
        },
        {
            id: 2,
            name: "Xbox",
            original_image : "http://localhost/github/pbp/media/pbp/images/main/original_xbox.png",
            options: [
                {
                    id: 10,
                    title: " Xbox Option 1",
                    thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/thumbnail.jpg",
                    main_image: "http://localhost/github/pbp/media/pbp/images/main/xbox.png"
                },
                {
                    id: 11,
                    title: " Xbox Option 2",
                    thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/btn_thumb.png",
                    main_image: "http://localhost/github/pbp/media/pbp/images/main/main_button.png"
                }
            ]
        }
    ];
    this.editOption = function(option) {
        console.log(option);
    }
    //Show log to see the development processing
    this.showLog = function(message, type) {
        if(self.isShowLog) {
            if(type !== undefined) {
                console[type](message);
            } else {
                console.log(message);
            }
            
        }
    }
    this.doRequest = function(url, data, callback) {
        $http.post(url, data).
        success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            callback(data);
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            self.showLog("Something went wrong!", "warn");
        });
    }
    //Save productbuilder group
    this.saveGroup = function(groupData) {
        var _saveUrl = self.base_url + "productbuilderpro/main/savegroup";
        self.doRequest(_saveUrl, groupData, function(response) {
            self.showLog("Response after save group", "info");
            self.showLog(response);
        });
    }
    //Get all PBP group
    this.getGroups = function() {
        var url = self.base_url + "productbuilderpro/main/getgroup";
        self.doRequest(url, null, function(response) {
            if(response) {
                self.pbpGroups = response;
                console.log(self.pbpGroups);
            }
        });
    }
}]);