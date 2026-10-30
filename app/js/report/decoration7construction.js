/** app/js/report/decoration7construction.js —— 装修施工报表（公司维度，含更新/导出）
 * 列：2015-2020 历年签单 + 30/65/97/100% 节点 + 各工种节点 + 设计节点 + 定金 + 签单/合计总数（派生列）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '序号', width: 60, fixed: 'left' },
            { field: 'company', title: '公司', width: 150, fixed: 'left' },
            { field: 'cs14', title: '2015年', width: 90 }, { field: 'cs15', title: '2016年', width: 90 },
            { field: 'cs16', title: '2017年', width: 90 }, { field: 'cs17', title: '2018年', width: 90 },
            { field: 'cs18', title: '2019年', width: 90 }, { field: 'cs19', title: '2020年', width: 90 },
            { field: 'cs20', title: '30%', width: 80 }, { field: 'cs21', title: '65%', width: 80 },
            { field: 'cs22', title: '97%', width: 80 }, { field: 'cs23', title: '100%', width: 80 },
            { field: 'cs0', title: '未开工', width: 90 }, { field: 'cs1', title: '已开工', width: 90 }, { field: 'cs2', title: '已完工', width: 90 },
            { field: 'cs3', title: '铲大白', width: 90 }, { field: 'cs4', title: '放线', width: 80 }, { field: 'cs5', title: '水暖', width: 80 },
            { field: 'cs6', title: '力工', width: 80 }, { field: 'cs7', title: '电工', width: 80 }, { field: 'cs8', title: '瓦工', width: 80 },
            { field: 'cs9', title: '地面找平', width: 100 }, { field: 'cs10', title: '木工', width: 80 }, { field: 'cs11', title: '油工', width: 80 },
            { field: 'cs12', title: '水电验收', width: 100 }, { field: 'cs13', title: '保洁', width: 80 },
            { field: 'cs24', title: '设计中', width: 90 }, { field: 'cs25', title: '设计完成', width: 100 }, { field: 'cs26', title: '定金总数', width: 100 },
            { field: 'signedNumber', title: '签单总数', width: 100, templet: function (d) { return (d.cs14 || 0) + (d.cs15 || 0) + (d.cs16 || 0) + (d.cs17 || 0) + (d.cs18 || 0) + (d.cs19 || 0); } },
            { field: 'houseTotal', title: '合计户数', width: 100, templet: function (d) { return (d.cs14 || 0) + (d.cs15 || 0) + (d.cs16 || 0) + (d.cs17 || 0) + (d.cs18 || 0) + (d.cs19 || 0) + (d.cs26 || 0); } }
        ]]
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnUpdate').on('click', function () {
        app.post(api.report.updateDecoration7Construction, {}, function () {
            app.showAlert(app.info, '更新成功'); query(state.page);
        });
    });
    $('#btnExport').on('click', exportation);

    function query(pg) {
        state.page = pg || 1;
        app.post(api.report.queryDecoration7Construction, { 'paging.page': state.page, 'paging.rows': state.rows }, function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } });
    }

    function exportation() {
        if (!state.total) { app.showAlert(app.warning, '请先更新数据'); return; }
        if (state.total > 2000) { app.showAlert(app.warning, '查询结果大于阀值，不能完成导出动作'); return; }
        app.showConfirm('是否确认导出', function () {
            app.post(api.report.queryDecoration7Construction, { 'paging.noPage': 1 }, function (res) {
                var list = (res.paging && res.paging.data) || [];
                var headers = ['公司', '2015年', '2016年', '2017年', '2018年', '2019年', '2020年', '30%', '65%', '97%', '100%', '未开工', '已开工', '已完工', '铲大白', '放线', '水暖', '力工', '电工', '瓦工', '地面找平', '木工', '油工', '水电验收', '保洁', '设计中', '设计完成', '定金总数', '签单总数', '合计户数'];
                var keys = ['company', 'cs14', 'cs15', 'cs16', 'cs17', 'cs18', 'cs19', 'cs20', 'cs21', 'cs22', 'cs23', 'cs0', 'cs1', 'cs2', 'cs3', 'cs4', 'cs5', 'cs6', 'cs7', 'cs8', 'cs9', 'cs10', 'cs11', 'cs12', 'cs13', 'cs24', 'cs25', 'cs26'];
                var rows = [headers.join(',')];
                for (var i = 0; i < list.length; i++) {
                    var v = list[i];
                    v.signedNumber = (v.cs14 || 0) + (v.cs15 || 0) + (v.cs16 || 0) + (v.cs17 || 0) + (v.cs18 || 0) + (v.cs19 || 0);
                    v.houseTotal = v.signedNumber + (v.cs26 || 0);
                    var line = keys.map(function (k) { return '"' + (v[k] != null ? v[k] : '') + '"'; });
                    line.push('"' + v.signedNumber + '"', '"' + v.houseTotal + '"');
                    rows.push(line.join(','));
                }
                var blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob); a.download = '装修施工报表.csv'; a.click();
            });
        });
    }

    query(1);
});
});
