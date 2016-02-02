/**
 * Content loader
 */
var ajaxQueue = $({});
$.ajaxQueue = function(ajaxOpts) {
    var jqXHR,
        dfd = $.Deferred(),
        promise = dfd.promise();

    ajaxQueue.queue(doRequest);

    promise.abort = function(statusText) {
        if (jqXHR) {
            return jqXHR.abort(statusText);
        }

        var queue = ajaxQueue.queue(),
            index = $.inArray(doRequest, queue);

        if (index > -1) {
            queue.splice(index, 1);
        }

        dfd.rejectWith(ajaxOpts.context || ajaxOpts, [ promise, statusText, ""]);

        return promise;
    };

    function doRequest(next) {
        console.log('do request:', next);
        jqXHR = $.ajax(ajaxOpts)
            .done(dfd.resolve)
            .fail(dfd.reject)
            .then(next, next);
    }

    return promise;
};

var LazyContent = LazyContent || {};
LazyContent = (function($) {
    var __LazyContent = {
        init: function( options ) {
            // apply option
            this.options = $.extend( {}, this.options, options );

            // compile template
            this.template = _.template(this.options.template);

            this.options.onInit();

            // register event
            this.renderItemInViewport();
        },
        options: {
            template: '',
            item: 'product-page',
            displayed: 'displayed',
            onRender: null,
            onLoaded: function() {},
            onInit: function() {}
        },
        template: function() {},
        load: function(elem, success) {
            var _this = this;
            var _url = elem.attr('data-url');

            //$.ajaxQueue({
            //    url: _url,
            //    type: 'GET',
            //    dataType: 'json',
            //    success: function(response) {
            //        elem.html(function(){
            //            return typeof _this.options.onRender == "function"
            //                ? _this.options.onRender(elem, response.data) : _this.render(response.data);
            //        });
            //        _this.options.onLoaded(elem, response);
            //        elem.addClass( _this.options.displayed );
            //    }
            //});

            var _xhr = $.getJSON(_url);
            _xhr.done(function(response) {
                elem.html(function(){
                    return typeof _this.options.onRender == "function"
                        ? _this.options.onRender(elem, response.data) : _this.render(response.data);
                });

                _this.options.onLoaded(elem, response);

                elem.addClass( _this.options.displayed );
            });
        },
        renderItemInViewport: function() {
            var _this = this;
            var __item = $('.' + this.options.item).not('.' + this.options.displayed);
            if (__item.length<=0) return;

            __item.waypoint({
                handler: function(direction) {
                    if ( $(this.element).hasClass(_this.options.displayed) ) return;

                    if(_this.options.onLoad){
                        _this.options.onLoad( $(this.element) );
                    }else{
                        _this.load( $(this.element) );
                    }

                    $(this.element).addClass( _this.options.displayed );
                },
                continuous: true,
                offset: '150%'
            });
        },
        render: function(data) {
            return this.template(data);
        }
    };

    return __LazyContent;
})(jQuery);

/** usage
$(window).load(function() {
    LazyContent.init({
        template: '',
        item: 'product-page',
        displayed: 'displayed'
    });
});
*/
