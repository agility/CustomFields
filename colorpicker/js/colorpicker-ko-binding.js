ko.bindingHandlers.colorpicker = {
    init: function (element, valueAccessor) {

        var params = ko.unwrap(valueAccessor());

        $(element).colorpicker({
            color: params.value(),
            format: params.format
        }).on('changeColor', function (e) {
            var value = $(element).colorpicker('getValue');
            params.value(value);
        });
    }
};