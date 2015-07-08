var pbpOrder = jQuery.noConflict();
pbpOrder(function($){
	var itemId, customizeLink;
    $(".view-customize-design").hide();
    $(".order-tables .item-container").each(function() {
        itemId = $(this).attr('id').split('_')[2];
        customizeLink = $("#customize-" + itemId).html();
        $(this).find(".item-options").prepend(customizeLink);
    });
});