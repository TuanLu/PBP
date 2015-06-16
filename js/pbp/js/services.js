pbpApp.service("groupServices", ["$http", "$q", "$rootScope", function($http, $q, $rootScope) {
    var self = this;
    this.base_url = document.getElementById("mst_base_url").value;
    this.media_url = document.getElementById("mst_media_url").value + "pbp/images/";
    this.groups = null;
    this.parents = null;
    this.currentLayer = null;
    // Return public API.
    return({
        groups: this.groups,
        updateGroupData: updateGroupData,
        broadcastGroups: broadcastGroups,
        parents: this.parents,
        currentLayer: this.currentLayer,
        addGroup: addGroup,
        getGroups: getGroups,
        getGroupById: getGroupById,
        removeGroup: removeGroup,
        uploadImage: uploadImage,
        addLayer: addLayer,
        removeLayer: removeLayer,
        getLayerParents: getLayerParents
    });
    //Public method for group
    function updateGroupData(groups) {
        this.groups = groups;
        this.broadcastGroups();
    }
    function broadcastGroups() {
        $rootScope.$broadcast('handleUpdateGroups');
    }
    function addGroup( groupData ) {
        var request = $http({
            method: "post",
            url: self.base_url + "productbuilderpro/main/savegroup",
            data: groupData
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function getGroups() {
        var request = $http({
            method: "get",
            url: self.base_url + "productbuilderpro/main/getgroup",
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function getGroupById(groupId) {
        var request = $http({
            method: "get",
            url: self.base_url + "productbuilderpro/main/getGroupById/id/" + groupId,
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function getLayerParents() {
        var request = $http({
            method: "get",
            url: self.base_url + "productbuilderpro/main/getLayerParents",
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function removeGroup(group) {
        var request = $http({
            method: "delete",
            url: self.base_url + "productbuilderpro/main/removegroup",
            data: {
                id: group.id
            }
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function uploadImage(file) {
        var fd = new FormData();
        fd.append('file', file);
        var uploadUrl = self.base_url + "productbuilderpro/main/uploadImage"
        var request = $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        return request.then(handleSuccess, handleError);
    }
    //Methos for layer
    function addLayer( layerData ) {
        var request = $http({
            method: "post",
            url: self.base_url + "productbuilderpro/main/saveLayer",
            params: {
                action: "add"
            },
            data: layerData
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function removeLayer(layer) {
        var request = $http({
            method: "delete",
            url: self.base_url + "productbuilderpro/main/removelayer",
            data: {
                id: layer.id
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
}]);

