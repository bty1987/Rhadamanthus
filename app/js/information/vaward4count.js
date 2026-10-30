/** app/js/information/vaward4count.js —— 大活动奖品统计*/
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    app.post(api.information.countVaward, {}, function (res) {
        var counts = res.counts || [];
        var rows = [];
        $.each(counts, function (i, v) { rows.push({ idx: i + 1, name: v[0], count: v[1] }); });
        table.render({ elem: '#resultTable', data: rows, page: false, limit: 1000, even: true,
            cols: [[ { field: 'idx', title: '#', width: 80 },
                { field: 'name', title: '名称', minWidth: 200 },
                { field: 'count', title: '数量', width: 200, align: 'right' } ]] });
    });
});
}); // end app.ready
