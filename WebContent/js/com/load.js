$.extend($,{
    /**
     * 动态加载js文件, 同时支持WEB和PC方式
     * @param filenames 文件路径和名称
     * @param relative 文件相对路径
     * @param frame PC方式的加载页面 , 可空为当前页面(frame)
     * @param zquery WEB方式的加载JQ库 , 可空为当前页面(JQuery)
     */
    loadScript : function(filenames, relative, frame, zquery) {

        if (filenames.length == 0) {
            return;
        }

        var filename = '';

        if (parent.window.isPC && parent.window.isEncryption) {
            
            if(!frame) frame = null;
            
            filename = filenames.shift();
            filename = filename.substring(0, filename.lastIndexOf('.')) + '.bin';

            win.evalNWBin(frame, filename);

            $.loadScript(filenames, relative, frame, zquery);

        } else {

            filename = filenames.shift();

            if(relative) filename = relative + filename;
            if(!zquery) zquery = $;

            console.log('[diag] loadScript fetching:', filename, 'remaining:', filenames.length);

            zquery.getScript(filename, function () {
                console.log('[diag] getScript success:', filename);
                $.loadScript(filenames, relative, frame, zquery);
            }).fail(function(jqxhr, settings, exception) {
                console.error('[diag] getScript FAIL:', filename, 'status:', jqxhr.status, 'exception:', exception);
            })
        }
    }
});

var layer = layui.layer;
var laydate = layui.laydate;
var laytable = layui.table;
var carousel = layui.carousel;