$.fn.textBlink = function(options) {
    var _settings,
    that = this;

    _settings = $.extend({
        activeCls: "text-blink-active",
        timeout: 3000
    }, options );

    return this.each(function() {
        var _ele = this;

        $(_ele).removeClass("text-blink-animation")
            .addClass("text-blink-animation")
            .addClass(_settings.activeCls);

        _ele._t = setTimeout(function(){
            $(_ele).removeClass(_settings.activeCls);

            clearTimeout(_ele._t);

        }, _settings.timeout);

        return this;
    });
};