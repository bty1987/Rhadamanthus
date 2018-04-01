$.extend($,{
    loadScript : function(filenames) {

        if (filenames.length == 0) {
            return;
        }

        var filename = '';

        if (config.isPC && config.isEncryption) {
            filename = filenames.shift();
            filename = filename.substring(0, filename.lastIndexOf('.')) + '.bin';

            require('nw.gui').Window.get().evalNWBin(null, filename);

            $.loadScript(filenames);

        } else {
            filename = filenames.shift();
            $.getScript(filename, function () {
                $.loadScript(filenames);
            })
        }
    }
});