pbpApp.service("pbpServices", [function() {
    var self = this;
    self.base_url = document.getElementById("mst_base_url").value;
    self.productList = [
        {
            name: "Play staytion 3",
            options: [
                {
                    title: " Option 1",
                    thumbnail: "thumbnail1.png",
                    main_image: "thumbnail1.png",
                },
                {
                    title: " Option 2",
                    thumbnail: "thumbnail2.png",
                    main_image: "thumbnail2.png",
                }
            ]
        },
        {
            name: "Xbox",
            options: [
                {
                    title: " Xbox Option 1",
                    thumbnail: "thumbnail1.png",
                    main_image: "thumbnail1.png",
                },
                {
                    title: " Xbox Option 2",
                    thumbnail: "thumbnail2.png",
                    main_image: "thumbnail2.png",
                }
            ]
        }
    ];
}]);