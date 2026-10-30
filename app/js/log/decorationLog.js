/**
 * app/js/log/decorationLog.js —— 图纸下载日志（只读）
 * 列：operateTime operateUserId operateUserName orderId dpId ip
 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table;
    var laypage = layui.laypage;
    var form = layui.form;
    var $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    logCommon.renderDateRange('#operateTime', 'operateTime');
    initTable();
    query(1);

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { field: 'operateTime', title: '下载时间', width: 170, templet: function (d) { return app.dateFormat(d.operateTime); } },
                { field: 'operateUserId', title: '操作人账号', width: 120 },
                { field: 'operateUserName', title: '操作人姓名', width: 120 },
                { field: 'orderId', title: '订单号', width: 140 },
                { field: 'dpId', title: '图纸ID', width: 100 },
                { field: 'ip', title: '来源IP', width: 140 }
                ]]
        });
    }

    function query(page) {
        state.page = page || 1;
        app.post(api.log.pageDecorationLog, $.extend({}, logCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page, 'paging.rows': state.rows
        }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }

    function renderPage() {
        laypage.render({
            elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows,
            limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); }
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
    $('#btnExport').on('click', function () {
        if (state.total === 0) { app.showAlert(app.warning, '请先查询出数据'); return; }
        logCommon.exportCSV('resultTable', '图纸下载日志');
    });
});
}); // end app.ready
