/** app/js/quotation/quotationRecord.js —— 报价记录（pageQuotationRecord，type=报价，qid 取自上下文）
 *  上下文：app.params.quotation.quotation.qid（报价编辑页弹窗传入）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var E = quotationCommon.ENUM;
    var qctx = quotationCommon.ctx('quotation') || {};
    var quotation = qctx.quotation || {};
    var state = { page: 1, rows: 10, total: 0 };

    quotationCommon.dateRange('#operatTime');

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'operater', title: '记录员', width: 120, templet: function (d) { return d.operater ? d.operater.currentName : ''; } },
            { field: 'type', title: '记录类型', width: 100, templet: function (d) { return E.quotationRecordType[d.type] != null ? E.quotationRecordType[d.type] : d.type; } },
            { field: 'operatTime', title: '记录时间', width: 170 },
            { field: 'comment', title: '说明', minWidth: 260 } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationRecord, $.extend({}, quotationCommon.buildFilters($('#searchForm')), {
            'quotationRecord.type': 1, 'quotationRecord.qid': quotation.qid,
            'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
