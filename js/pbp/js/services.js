pbpApp.service("pbpServices", ["$rootScope", function($rootScope) {
    var self = this;
    self.base_url = document.getElementById("mst_base_url").value;
    self.isShowLog = true;
    self.currentOption = null;
    self.productList = [
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
    self.editOption = function(option) {
        console.log(option);
    }
    //Show log to see the development processing
    self.showLog = function(message, type) {
        if(self.isShowLog) {
            if(type !== undefined) {
                console[type](message);
            } else {
                console.log(message);
            }
            
        }
    }
}]);