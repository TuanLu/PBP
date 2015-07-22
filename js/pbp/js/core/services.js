pbpApp.service("groupServices", ["$http", "$q", "$rootScope", function($http, $q, $rootScope) {
    var self = this;
    this.base_url = document.getElementById("mst_base_url").value;
    this.media_url = document.getElementById("mst_media_url").value + "pbp/images/";
    this.groups = null;
    this.libraryImages = null;
    this.parents = null;
    this.currentLayer = null;
    this.layerStack = {};
    this.currentGroupId = null;
    // Return public API.
    return({
        groups: this.groups,
        libraryImages: this.libraryImages,
        layerStack: this.layerStack,
        updateGroupData: updateGroupData,
        updateSelectedLayer: updateSelectedLayer,
        broadcastGroups: broadcastGroups,
        broadcastStackLayer: broadcastStackLayer,
        parents: this.parents,
        currentLayer: this.currentLayer,
        currentGroupId: this.currentGroupId,
        addGroup: addGroup,
        getGroups: getGroups,
        getLibraryImages: getLibraryImages,
        getGroupById: getGroupById,
        removeGroup: removeGroup,
        uploadImage: uploadImage,
        addLayer: addLayer,
        removeLayer: removeLayer,
        getLayerParents: getLayerParents,
        initLayerStack: initLayerStack,
        shuffleLayers: shuffleLayers,
        removeSelectedLayerByRootId: removeSelectedLayerByRootId,
        getRandomInt: getRandomInt,
        createThumbnail: createThumbnail,
        addToCart: addToCart,
        saveSampleDesign: saveSampleDesign
    });
    //Public method for group
    function updateGroupData(groups) {
        this.groups = groups;
        this.broadcastGroups();
    }
    function broadcastGroups() {
        $rootScope.$broadcast('handleUpdateGroups');
    }
    //Update selected layer
    function updateSelectedLayer(layerStack) {
        this.layerStack = layerStack;
        this.broadcastStackLayer();
    }
    function broadcastStackLayer() {
        $rootScope.$broadcast('handleUpdateLayerStack');
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
    function getLibraryImages() {
        var request = $http({
            method: "get",
            url: self.base_url + "productbuilderpro/main/getlibraryimages",
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
    //Init layerStack to store selected layer
    function initLayerStack(group) {
        console.info("Init LayerStack On Services");
        if(!this.layerStack[group.id]) {
            this.layerStack[group.id] = {};
        }
        this.shuffleLayers(group);
        //return this.layerStack;
    }
    //Make default selected layers or random selected layers
    function shuffleLayers(group) {
        var level1Layer,
            level2Layer,
            randomIndex,
            layerDetails,
            self = this;
        if(group.layers) {
            angular.forEach(group.layers, function(childLayer, index) {
                //Remove selected layer in current root
                self.removeSelectedLayerByRootId(childLayer.id, group.id);
                //Check the layer selectedable in which level
                //Right now supported 2 level only, for another level, need more custom code here
                if(childLayer.options) {
                    randomIndex = self.getRandomInt(0, (childLayer.options.length));
                    level1Layer = childLayer.options[0];
                    //Check if level1Layer has options or not
                    if(level1Layer.options) {
                        level2Layer = childLayer.options[randomIndex];
                        if(level2Layer.options) {
                            randomIndex = self.getRandomInt(0, level2Layer.options.length);
                            layerDetails = level2Layer.options[randomIndex];
                            //Add root info
                            layerDetails.root_id = childLayer.id;
                            layerDetails.root_title = childLayer.title;
                            layerDetails.root_zindex = childLayer.zindex;
                            self.layerStack[group.id][level2Layer.options[randomIndex].id] = layerDetails;    
                        }
                    } else {
                        layerDetails = childLayer.options[randomIndex];
                        //Add root info
                        layerDetails.root_id = childLayer.id;
                        layerDetails.root_title = childLayer.title;
                        layerDetails.root_zindex = childLayer.zindex;
                        self.layerStack[group.id][childLayer.options[randomIndex].id] = layerDetails;
                    }
                }
            });
        }
    }
    // If there is child layer of root layer in stack, remove this one and add new layer
    function removeSelectedLayerByRootId(rootId, groupId) {
        var self = this;
        if(self.layerStack && self.layerStack[groupId]) {
            angular.forEach(self.layerStack[groupId], function(selectedLayer, index) {
                if(selectedLayer.root_id == rootId) {
                    delete self.layerStack[groupId][selectedLayer.id];
                    self.updateSelectedLayer(self.layerStack);
                    return true;
                }
            });
        }
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
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
    function createThumbnail(selectedLayer) {
        var request = $http({
            method: "post",
            url: self.base_url + "productbuilderpro/main/createThumbnail",
            data: selectedLayer
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function addToCart(cartData) {
        var request = $http({
            method: "post",
            url: self.base_url + "productbuilderpro/main/addToCart",
            data: cartData
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function saveSampleDesign(layers) {
        var request = $http({
            method: "post",
            url: self.base_url + "productbuilderpro/main/saveSampleDesign",
            data: layers
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

