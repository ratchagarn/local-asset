var ajaxLoadingWidget = (function($){
    var me = this;

    me.initial = function(){
        $(document).bind("show-ajax-loading", me.show);
        $(document).bind("hide-ajax-loading", me.hide);
    };

    me.show = function(){
        $(".ajaxloading-widget-background").fadeIn();
        $(".ajaxloading-widget-icon-container").fadeIn();
    };

    me.hide = function(){
        $(".ajaxloading-widget-background").fadeOut();
        $(".ajaxloading-widget-icon-container").fadeOut();
    };
    return me;
})(jQuery);

$(document).ready(function(){
    ajaxLoadingWidget.initial();

    $("form").bind("submit.ajaxloadingwidget", function(e){
        if($(this).valid != undefined){
            //in case: jquery validator plugin.
            var isvalidate = $(this).valid();
            if(isvalidate)
            {
                ajaxLoadingWidget.show();
            }
        }else{
            //in case: no jquery validator plugin.
            ajaxLoadingWidget.show();
        }
    });

    //don't bind event on step3 form and do it with custom code.
    $("form#form-payment, form.no-loading-icon").unbind("submit.ajaxloadingwidget");
});