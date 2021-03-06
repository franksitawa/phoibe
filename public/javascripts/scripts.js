$(document).ready(function() {
    /*
    if($('#modal').length > 0) {
        $('#modal').modal({
            backdrop: 'static',
            keyboard: true
        });
    }
    */

    $('[modal]').click(function(e) {
        e.preventDefault();
        $('#modal').load(e.target.href, function() {
            if($(e.srcElement).attr('target')) {
                $('#modal').attr('target', $(e.srcElement).attr('target'));
            }
            $('#modal').modal('show');
        });
    });

    $("[rel=popover]")
        .popover({
            placement: 'bottom',
            html: true,
            content: function() {
                $.ajax({
                    url: $(this).attr('data-source'),
                    async: false,
                    complete: function(data){
                        text = data.responseText;
                    }
                });

                return text;
            }
        });

    $('[rel=datepicker]').datepicker($.datepicker.regional[ "de" ]);

    $('[rel=editor]').each(function(index) {
        CKEDITOR.replace($(this).attr('id'), {
            toolbar: [ [ 'Bold', 'Italic', 'Underline', 'Subscript', 'Superscript' ] ],
            coreStyles_bold	: { element : 'b' },
            coreStyles_italic : { element : 'i' },
            enterMode: CKEDITOR.ENTER_BR
        });
    });
});

function createAutocomplete(hiddenElement, ajaxUrl, infoUrl, infoTitle) {
    var chooserElement = $("#" + hiddenElement.attr('id') + "_chooser");
    chooserElement.autocomplete({
        source: function(request, response)
        {
            $.ajax({
                url: ajaxUrl,
                dataType: "json",
                data: {
                    search: request.term
                },
                success: function(data)
                {
                    response($.map(data, function(item)
                    {
                        return {
                            label: item.label,
                            value: item.id
                        }
                    }));
                }
            });
        },
        minLength: 1,
        focus: function(event, ui)
        {
            chooserElement.val(ui.item.label);
            return false;
        },
        select: function(event, ui)
        {
            if (ui.item) {
                hiddenElement.val(ui.item.value);
                chooserElement.val(ui.item.label);
                if(infoUrl) {
                    chooserElement.parent().siblings('.help-inline').first().html('<span class="label">Info</span>');
                    chooserElement.parent().siblings('.help-inline').first().children('.label').first().popover({
                        title: function() { return infoTitle },
                        placement: 'bottom',
                        content: function() {
                            $.ajax({
                                url: infoUrl({id: ui.item.value}),
                                async: false,
                                complete: function(data){
                                    text = data.responseText;
                                }
                            });
                            return text;
                        }
                    });
                }
                return false;
            }
        }
    });
}

function submitModal(modalElement, ajaxUrl, infoUrl, infoTitle) {
    element = $('#' + modalElement);
    form  = $('#' + modalElement + ' form');
    data = form.serialize();

    $.ajax({
    type: "POST",
    url: ajaxUrl,
    data: data,
    complete: function(data) {
        if(data.status == 200) {
            var object = jQuery.parseJSON(data.responseText);
            $('#' + element.attr('target')).val(object.id);
            $('#' + element.attr('target') + '_chooser').val(object.label);
            $('#' + element.attr('target') + '_chooser').parent().siblings('.help-inline').first().html('<span class="label">Info</span>');
            $('#' + element.attr('target') + '_chooser').parent().siblings('.help-inline').first().children('.label').first().popover({
                title: function() { return infoTitle },
                offset: 10,
                html: true,
                placement: 'below',
                content: function() {
                    $.ajax({
                        url: infoUrl({id: object.id}),
                        async: false,
                        complete: function(data){
                            text = data.responseText;
                        }
                    });
                    return text;
                }
            });
            element.modal('hide');
        } else {
            element.html(data.responseText);
        }
    }
    });
}

function submitPartialModal(modalElement, ajaxUrl) {
    element = $('#' + modalElement);
    form  = $('#' + modalElement + ' form');
    data = form.serialize();

    $.ajax({
    type: "POST",
    url: ajaxUrl,
    data: data,
    complete: function(data) {
        if(data.status == 200) {
            var object = jQuery.parseJSON(data.responseText);

            for(var key in object) {
                var targetElement = $('#' + key);
                if(targetElement.nodeName == 'input') {
                    targetElement.val(object[key]);
                } else {
                    targetElement.html(object[key]);
                }
            }
            element.modal('hide');
        } else {
            element.html(data.responseText);
        }
    }
    });
}