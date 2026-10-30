/** app/js/quotation/quotationPart.version.js —— 报价编辑器 v2 扩展（配合 quotationPart.js 一起加载）
 *  移植旧 quotationConfig.js（配置管理：默认展开/显示空项）+ quotationToggle.js（全部展开/收起），
 *  以工具按钮形式注入工具栏，编辑主体逻辑复用 quotationPart.js。 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();

    // 等待 quotationPart 渲染完成（功能区卡片就绪后注入按钮）
    setTimeout(function () {
        var $bar = $('<span id="versionToggleBar" style="margin-left:12px;"><\/span>');
        $bar.append('<button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="btnExpandAll"><i class="layui-icon layui-icon-down"><\/i>全部展开<\/button>');
        $bar.append('<button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="btnCollapseAll"><i class="layui-icon layui-icon-up"><\/i>全部收起<\/button>');
        $bar.append('<button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="btnShowEmpty"><i class="layui-icon layui-icon-eye"><\/i>显示空功能区<\/button>');
        $bar.append('<button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="btnHideEmpty"><i class="layui-icon layui-icon-eye-invisible"><\/i>隐藏空功能区<\/button>');
        $('#btnBack').before($bar);

        $('#btnExpandAll').on('click', function () { $('#areaTables .layui-card-body').show(); });
        $('#btnCollapseAll').on('click', function () { $('#areaTables .layui-card-body').hide(); });
        $('#btnHideEmpty').on('click', function () {
            $('#areaTables .layui-card').each(function () {
                if (!$(this).find('.layui-table tbody tr').length) $(this).hide();
            });
        });
        $('#btnShowEmpty').on('click', function () { $('#areaTables .layui-card').show(); });
    }, 600);
});
}); // end app.ready
