/**
 * app/js/log/kingdeeSyncLog.js —— 金蝶同步日志（只读）
 * 列：createTime orderId atttype(属性类型) type(款项类型) rtid message operateUserId
 * atttype 枚举：0=合同预付款 1=主材预付款
 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table;
    var laypage = layui.laypage;
    var form = layui.form;
    var $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var ATTTYPE_MAP = { 0: '合同预付款', 1: '主材预付款' };

    logCommon.renderDateRange('#createTime', 'createTime');
    initTable();
    query(1);

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { field: 'createTime', title: '同步时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } },
                { field: 'orderId', title: '订单号', width: 140 },
                { field: 'atttype', title: '属性类型', width: 120, templet: function (d) { return ATTTYPE_MAP[d.atttype] != null ? ATTTYPE_MAP[d.atttype] : (d.atttype || ''); } },
                { field: 'type', title: '款项类型', width: 120 },
                { field: 'rtid', title: '收据ID', width: 100 },
                { field: 'message', title: '同步结果', minWidth: 200 },
                { field: 'operateUserId', title: '操作人', width: 120 }
                ]]
        });
    }

    function query(page) {
        state.page = page || 1;
        app.post(api.log.pageKingdeeSyncLog, $.extend({}, logCommon.buildFilters($('#searchForm')), {
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
        logCommon.exportCSV('resultTable', '金蝶同步日志');
    });
});
}); // end app.ready
