$.extend($,{
    loadScript : function(filenames) {

        if (filenames.length == 0) {
            return;
        }

        var filename = '';

        if (parent.window.isPC && parent.window.isEncryption) {
            filename = filenames.shift();
            filename = filename.substring(0, filename.lastIndexOf('.')) + '.bin';

            win.evalNWBin(null, filename);

            $.loadScript(filenames);

        } else {
            filename = filenames.shift();
            $.getScript(filename, function () {
                $.loadScript(filenames);
            })
        }
    }
});