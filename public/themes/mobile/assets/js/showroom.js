if (!('APP' in window)) {
    window.APP = {};
}

if (!('APP.itm' in window)) {
    window.APP.itm = {};
}

(function (itm, $, undefined) {

    itm.initShowroom = function () {

        var fnLoad = function(ele){
            if (ele.hasClass('displayed')) return;
            ele.addClass('displayed');

            var _req = ele.attr("data-url");
            if(!_req) return;

            var nocache = $.getQueryString('no-cache');
            if(nocache){
                _req += "&no-cache=1";
            }

            $.ajax({
                url: _req,
                success: function(res){
                    ele.removeClass('loading');
                    if(res.data){
                        ele.replaceWith(res.data);
                        $('img.lazyload:not(.lazyloaded)').lazyload({
                            threshold: 200,
                            effect: 'fadeIn'
                        });
                        $("img.lazyload:not(.lazyloaded)").addClass("lazyloaded");
                    }else{
                        ele.remove();
                    }
                },
                error: function(){
                    ele.remove();
                }
            });
        };

        if($(".showroom-container").length > 0){
            LazyContent.init({
                item: 'showroom-container',
                displayed: 'displayed',
                onLoad: fnLoad
            });
        }
    };

    itm.init = function () {
        for (var key in itm) {
            if (key !== 'init') {
                itm[key]();
            }
        }

    };

})(window.APP.itm, jQuery);

jQuery(function ($) {
    /*$(document).on('showroomReady', function() {
        APP.itm.init();
    });*/

    APP.itm.init();

    // On Load
    $img = $ ( '.showroom-banner' );
    (resize = function () {
        w = $img.parents ( '.col-medium' ).width ();
        $img.parents ('.showroom-banner--container').css ( {
            marginLeft: -(1000 - w) / 2
        } );
    }) ();

    $ ( window ).on ( 'resize', resize );

});

(function ( $ ) {
    // For Ajax
    var resize, w,
        $img;

    $(document).ajaxComplete(function(a,b,c){
        if(c.url.match(/action\=showroom/ig)){
            $img = $ ( '.showroom-banner' );
            (resize = function () {
                w = $img.parents ( '.col-medium' ).width ();
                $img.parents ('.showroom-banner--container').css ( {
                    marginLeft: -(1000 - w) / 2
                } );
            }) ();

            $ ( window ).on ( 'resize', resize );
        }
    });
}) ( jQuery );