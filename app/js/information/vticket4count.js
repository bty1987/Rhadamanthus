/** app/js/information/vticket4count.js —— 活动票统计（按数量降序）*/
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    // 标题列：默认为"票数"，param=1 显示"已到场"，param=2 显示"已注册"
    var thirdTitle = '票数';
    try {
        var qs = window.location.search.substring(1).split('&');
        for (var i = 0; i < qs.length; i++) {
            var kv = qs[i].split('=');
            if (kv[0] === 'param') {
                if (kv[1] === '1') thirdTitle = '已到场';
                else if (kv[1] === '2') thirdTitle = '已注册';
                break;
            }
        }
    } catch (e) {}

    app.post(api.information.countVticket, {}, function (res) {
        var counts = res.counts || [];
        counts.sort(function (a, b) { return b[2] - a[2]; });
        var rows = [];
        $.each(counts, function (i, v) { rows.push({ idx: i + 1, name: v[0], amount: v[1], count: v[2] }); });
        table.render({ elem: '#resultTable', data: rows, page: false, limit: 1000, even: true,
            cols: [[ { field: 'idx', title: '#', width: 80 },
                { field: 'name', title: '名称', minWidth: 200 },
                { field: 'amount', title: '数量', width: 150, align: 'right' },
                { field: 'count', title: thirdTitle, width: 150, align: 'right' } ]] });
    });
});
}); // end app.ready
