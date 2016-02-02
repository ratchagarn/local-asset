$(document).ready(function(){
    $('form.form-search').submit(function (event) {
        event.preventDefault();

        var submitUrl = $(this).attr("action") + "?";
        window.location.href = submitUrl + "q=" + encodeURIComponent($('input[name="q"]').val());

        return false;
    });
});