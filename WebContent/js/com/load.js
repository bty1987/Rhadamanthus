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

            zquery.getScript(filename, function () {
                $.loadScript(filenames, relative, frame, zquery);

                // i18n:页面所有脚本加载完毕后,按 URL 自动加载模块语言包 + apply 翻译
                // 约定:页面 URL 形如 views/{module}/xxx.html,自动识别 {module}
                if (filenames.length === 0 && window.i18n) {
                    try {
                        i18n._autoInitForPage();
                    } catch (e) { /* i18n 失败不影响业务功能 */ }
                }
            }).fail(function(jqxhr, settings, exception) {
                console.error('loadScript fail:', filename, 'status:', jqxhr.status, 'exception:', exception, exception && exception.stack ? '\n' + exception.stack : '');
            })
        }
    }
});

var layer = layui.layer;
var laydate = layui.laydate;
var laytable = layui.table;
var carousel = layui.carousel;