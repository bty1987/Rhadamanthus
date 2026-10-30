/** app/js/report/chainpage.js —— 外链页面（queryChainPageForSelf 返回当前用户可见外链，点击新窗口打开） */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;

    app.post(api.data.queryChainPageForSelf, {}, function (res) {
        var list = res.chainPages || [];
        if (!list.length) { $('#resultList').html('<div class="layui-col-md12" style="padding:30px;text-align:center;color:#999;">无可用数据提供</div>'); return; }
        var html = '';
        $.each(list, function (i, v) {
            html += '<div class="layui-col-md4">'
                + '<div class="layui-card"><div class="layui-card-header">' + (v.name || '') + '</div>'
                + '<div class="layui-card-body">'
                + '<p style="color:#666;min-height:40px;">' + (v.comment || '') + '</p>'
                + '<a class="layui-btn layui-btn-warm layui-btn-sm" href="' + (v.url || '#') + '" target="_blank" rel="noopener">外链</a>'
                + '</div></div></div>';
        });
        $('#resultList').html(html);
    });
});
});
