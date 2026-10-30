/** app/js/information/phoneCall.js —— 通话记录（分页查询）*/
app.ready(function () {
layui.use(['table', 'laypage', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    var STOP_MAP = { 0: '正常', 1: '客户挂断', 2: '客服挂断', 3: '未接通' };
    var REC_MAP = { 0: '本地', 1: '云端' };

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'callbackId', title: '编号', width: 130 },
                { field: 'orderId', title: '订单编号', width: 140 },
                { field: 'operater', title: '操作人', width: 110, templet: function (d) { return d.operater ? d.operater.userName : ''; } },
                { field: 'operateTime', title: '操作时间', width: 160 },
                { field: 'caller', title: '主叫', width: 130 },
                { field: 'callee', title: '被叫', width: 130 },
                { field: 'startTime', title: '开始时间', width: 160 },
                { field: 'endTime', title: '结束时间', width: 160 },
                { field: 'stopReason', title: '挂断原因', width: 100, templet: function (d) { return STOP_MAP[d.stopReason] || '---'; } },
                { field: 'duration', title: '时长(秒)', width: 100, align: 'right' },
                { field: 'recordType', title: '录音类型', width: 100, templet: function (d) { return REC_MAP[d.recordType] || '---'; } },
                { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'record' && obj.data.recordUrl) window.open(app.config.media + obj.data.recordUrl); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pagePhoneCall, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
});
}); // end app.ready
