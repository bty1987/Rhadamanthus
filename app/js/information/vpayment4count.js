/** app/js/information/vpayment4count.js —— 大活动收款统计（按金额降序）*/
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    app.post(api.information.countVpayment, {}, function (res) {
        var counts = res.counts || [];
        counts.sort(function (a, b) { return b[1] - a[1]; });
        var rows = [];
        $.each(counts, function (i, v) { rows.push({ idx: i + 1, name: v[0], money: v[1] }); });
        table.render({ elem: '#resultTable', data: rows, page: false, limit: 1000, even: true,
            cols: [[ { field: 'idx', title: '#', width: 80 },
                { field: 'name', title: '名称', minWidth: 200 },
                { field: 'money', title: '金额(元)', width: 200, align: 'right', templet: function (d) { return app.formatMoney(d.money); } } ]] });
    });
});
}); // end app.ready
