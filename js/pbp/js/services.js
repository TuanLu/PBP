pbpApp.service("pbpServices", [function() {
    var self = this;
    self.base_url = document.getElementById("mst_base_url").value;
    self.productList = [
        {
            name: "Play staytion 3",
            original_image: "http://localhost/github/pbp/media/pbp/images/main/original_ps3.png",
            options: [
                {
                    title: " Option 1",
                    thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/thumbnail.jpg",
                    main_image: "http://localhost/github/pbp/media/pbp/images/main/ps3.png"
                },
                {
                    title: " Option 2",
                    thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/btn_thumb.png",
                    main_image: "http://localhost/github/pbp/media/pbp/images/main/button.png"
                }
            ]
        },
        {
            name: "Xbox",
            original_image : "http://localhost/github/pbp/media/pbp/images/main/original_xbox.png",
            options: [
                {
                    title: " Xbox Option 1",
                    thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/thumbnail.jpg",
                    main_image: "http://localhost/github/pbp/media/pbp/images/main/xbox.png"
                },
                {
                    title: " Xbox Option 2",
                    thumbnail: "http://localhost/github/pbp/media/pbp/images/thumbnail/btn_thumb.png",
                    main_image: "http://localhost/github/pbp/media/pbp/images/main/main_button.png"
                }
            ]
        }
    ];
}]);