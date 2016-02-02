
$(document).ready(function () {

    $(".ajax-widget").each(ajaxWidget);

    addCountdown(1);

    $(window).scroll(triggerScrollButton);
});

function ajaxWidget() {
    var _this = $(this),
        done_trigger = _this.data("done_trigger") || null,
        method = _this.data("method"),
        url = _this.data("url");

    var xhr = $.ajax({
        type: method.toUpperCase(),
        url: url
    });

    xhr.done(ajaxWidgetDone);

    xhr.fail(ajaxWidgetFail);

    function ajaxWidgetDone(msg) {
        renderOgMeta();

        switch (done_trigger) {
            case 'showroomReady':
                _this.html(msg);
                _this.css({
                    backgroundImage: 'none',
                    height: 'auto'
                });
                break;
            case 'doneGetMiniCart':
                var url_lang = '/';
                if(LANG != 'th'){
                    url_lang = '/'+LANG+'/';
                }

                _this.replaceWith('<div class="ui-cart">\
                    <a href="'+url_lang+'cart" class="shop-cart-link"><span id="cart-total"></span></a>\
                </div>');
                setCartTotal(msg.data);
                break;
            default:
                _this.replaceWith(msg);
                break;
        }

        if (done_trigger != null) {
            $(document).trigger(done_trigger);
        }
    }

    function ajaxWidgetFail() {
        _this.remove();
    }
}

function setCartTotal(total) {
    var total_item = total || 0,
        cart_total = $('#cart-total');
    if (!total_item) {
        cart_total.hide();
        return;
    }

    cart_total.html(total).show();
}

function triggerScrollButton() {
    if ($(window).scrollTop() + $(window).height() > 1500) {
        $('#backtotop-arrow').show();
    } else {
        $('#backtotop-arrow').hide();
    }
}

function renderOgMeta() {
    var content = $('#content');
    var ogImage = content.find('.product-image .swiper-slide img').attr('src');
    var ogTitle = content.find('.product-name h1').text();
    var ogUrl = 'http://www.itruemart.com/' + window.location.pathname;
    var ogDescription = ogTitle;

    if (!ogTitle) {
        return;
    }

    createOpenGraphFB('image', ogImage);
    createOpenGraphFB('title', ogTitle);
    createOpenGraphFB('url', ogUrl);
    createOpenGraphFB('description', ogDescription);
}

function createOpenGraphFB(type, content) {
    if (content == undefined || content.length == 0)
        return;

    var $meta = $('meta[property="og:' + type + '"]');
    if ($meta.length == 0) {
        content = (type == 'image') ? 'http:' + content : content;
        $('head').append('<meta property="og:' + type + '" content="' + content + '">');
    }

}
function addCountdown() {
    var countDownTag = $('[data-countdown]');

    if (countDownTag.length <= 0) {
        return;
    }

    countDownTag.each(function (_idx) {

        if ($(this).hasClass('registered-countdown')) return;
        $(this).addClass('registered-countdown');

        var _self = $(this), finalDate = _self.data('countdown');
        var _ignore_reload = _self.attr('data-reload');
        var eventType = _self.data('eventtype');

        //var _idx = $('[data-countdown]').index(this);
        _self.countdown(finalDate, function (event) {

            var totalHours = event.offset.totalDays * 24 + event.offset.hours;
            var _format = totalHours + ':%M:%S';

            _self.html(event.strftime(_format));
        }).on('finish.countdown', function (event) {

            if (eventType == 'open') {
                var url = location.href;
                var url_refresh = (url.indexOf('?') > 0 ? url.split('?')[0] : url) + '?frefresh=1&rand=' + Math.floor(Math.random() * 9999) + 1001;
                var finalDateCountDown = (new Date(finalDate)).getTime() + 90000;
                setInterval(function () {
                    var now = new Date();
                    if (now.getTime() > finalDateCountDown) {
                        window.location = url_refresh;
                    }
                }, 30000);
            }
            else {
                if (_ignore_reload != '0') {
                    setTimeout(function () {
                        window.location.href = (window.location.href.indexOf('?') > 0 ? window.location.href.split('?')[0] : window.location.href) + '?_=' + Math.random();
                    }, 60000);
                }
            }

        });
    });
}
