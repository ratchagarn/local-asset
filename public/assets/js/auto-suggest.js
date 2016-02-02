(function ($) {
    Number.prototype.format = function (n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };

    $.fn.autoSuggest = function () {
        var _search = $('#search-text'),
            _suggest_result = $('#suggest-result'),
            _minString = 2,
            _delay = 180,
            _currentQuery = '',
            _cache = {},
            _text = {
                "th": {
                    "about": "ผลลัพธ์",
                    "results": "คำค้นหา"
                },
                "en": {
                    "about": "about",
                    "results": "keyword(s)"
                }
            },
            _langURL = (LANG == 'th' ? '' : LANG + '/'),
            _resultTemplate = '<ul class="search-suggestion__list"><% _.each(suggestion, function(item, index){ %><li class="search-suggestion__item"><span class="fill-auto-suggest" data-raw="<%= item.result %>"><span class="result-text"><%= item.result %></span><span class="search-suggestion__result"><strong><%= item.found.format() %></strong> ' + _text[LANG]['results'] + '</span></span></li><% }); %></ul>',
            _template = _.template(_resultTemplate);

        if (_search.length <= 0) {
            return;
        }

        $('body').delegate('.fill-auto-suggest', 'click', function (e) {
            e.preventDefault();

            // clear suggestion
            clearsuggest();

            // fill data in _search
            var searchQuery = $(this).attr('data-raw');

            if(searchQuery.length != 0){
                _search.val(searchQuery);
            }


            // show loading
            $(document).trigger("show-ajax-loading");

            // redirect to search
            var redirect_http = site_url_nolang.replace("https", "http");
            window.location.href = redirect_http + _langURL + 'search2?q=' + searchQuery;

            return false;
        });

        $('body').on('click', function (e) {
            if ($(e.target).attr('id') != 'search-text') {
                clearsuggest();
            }
        }).on('mouseover', '.search-suggestion__item', function(e){
            _addActiveSuggestion($(this))
        });

        var _addActiveSuggestion = function(ele){
            $(".search-suggestion__item").removeClass("active");
            ele.addClass("active");

            var searchQuery = $(".search-suggestion__item.active .fill-auto-suggest").attr('data-raw');
            if(searchQuery.length != 0){
                _search.val(searchQuery);
            }

        }

        var renderTemplate = function (data, find) {
            _suggest_result.show();
            _suggest_result.html(_template(data));

            var regex = new RegExp(find, 'ig');

            // hilight text
            _suggest_result.find('.result-text').each(function () {
                var _text = $(this).html();

                $(this).html(_text.replace(regex, function (match) {
                    return '<strong>' + match + '</strong>';
                }));
            });
        };

        var clearsuggest = function () {
            _currentQuery = '';

            _suggest_result.hide();
            _suggest_result.html('');
        };

        var getsuggest = function (queryString) {
            if (_currentQuery == queryString) {
                return;
            }

            _currentQuery = queryString;

            // check cache data
            if (_cache.hasOwnProperty(_currentQuery)) {
                // render from cache data
                renderTemplate(_cache[_currentQuery], _currentQuery);
                return;
            }

            // get data from ajax
            $.getJSON(site_url_nolang + _langURL + 'ajax/auto-suggestion', {"q": _currentQuery}, function (response) {
                if (!response.status == 'success') {
                    return;
                }

                // cache data
                _cache[_currentQuery] = response.data;

                // render template
                renderTemplate(response.data, _currentQuery);
            });

        };

        _search.bindWithDelay("keyup", function (e) {
            _searchString = $(this).val();
            if (_searchString.length < _minString || e.keyCode == 13) {
                clearsuggest();
                return;
            }

            if(e.keyCode == 38 || e.keyCode == 40){
                e.preventDefault();
                return false;
            }

            getsuggest(_searchString);
        }, _delay, true);

        _search.on("keydown", function(e){
            if(e.keyCode == 38){
                var _activeEle = $(".search-suggestion__item.active");
                var _activeIdx = $(".search-suggestion__item").index(_activeEle);
                var prevIdx = _activeIdx-1;
                if(prevIdx < 0){
                    prevIdx = 0;
                }
                _addActiveSuggestion($(".search-suggestion__item").eq(prevIdx));

                e.preventDefault();
                return false;

            }else if(e.keyCode == 40){
                var _activeEle = $(".search-suggestion__item.active");
                var _activeIdx = $(".search-suggestion__item").index(_activeEle);
                var nextIdx = _activeIdx+1;
                var all = $(".search-suggestion__item").length;
                if(nextIdx >= all){
                    nextIdx = all - 1;
                }
                _addActiveSuggestion($(".search-suggestion__item").eq(nextIdx));

                e.preventDefault();
                return false;

            }
        });
    }
})(jQuery);

$(document).ready(function () {
    $(this).autoSuggest();
});

$(document).on('doneLevelDContent doneLevelC doneLevelCSub', function () {
    $(this).autoSuggest();
});
