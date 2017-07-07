require(['gitbook', 'jQuery'], function (gitbook, $) {
    var versions = [];

    // Update the select with a list of versions
    function updateVersions(_versions) {
        versions = _versions || versions;

        // Cleanup existing selector
        $('.versions-select').remove();

        if (versions.length == 0) return;

        var $li = $('<li>', {
            'class': 'versions-select',
            'html': '<div><select></select></div>'
        });
        var $select = $li.find('select');

        $.each(versions, function(i, version) {
            var $option = $('<option>', {
                'selected': version.value === window.location.origin,
                'value': version.value,
                'text': version.text
            });

            $option.appendTo($select);
        });

        $select.change(function() {
            var filtered = $.grep(versions, function(v) {
                return v.value === $select.val();
            });
            // Get actual version Object from array
            var version = filtered[0];
            window.location.href = version.value;
        });

        $li.prependTo('.book-summary ul.summary');
    }

    gitbook.events.bind('start', function (e, config) {
        var pluginConfig = config.versions || {};
        if (pluginConfig.options) {
            updateVersions(pluginConfig.options);
        }
    });

    gitbook.events.bind('page.change', function () {
        updateVersions();
    });
});
