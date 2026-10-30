/** app/js/quotation/quotationAssignRecord.js —— 预算分配记录（pageQuotationAssignRecord，只读） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0 };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单号', width: 110, fixed: 'left' },
            { field: 'company', title: '公司', width: 150, templet: function (d) { return d.company ? d.company.name : '未知'; } },
            { field: 'department', title: '部门', width: 130, templet: function (d) { return d.department ? d.department.name : '所有部门'; } },
            { field: 'decorationType', title: '装修类型', width: 90, templet: function (d) { return E.assignDecorationType[d.decorationType] != null ? E.assignDecorationType[d.decorationType] : '未知'; } },
            { field: 'budgetUser', title: '预算员', width: 100, templet: function (d) { return d.budgetUser ? d.budgetUser.currentName : '未知'; } },
            { field: 'assignType', title: '分配方式', width: 90, templet: function (d) { return E.assignRecordType[d.assignType] != null ? E.assignRecordType[d.assignType] : d.assignType; } },
            { field: 'assignResult', title: '分配结果', width: 90, templet: function (d) { return qc.badge(E.assignRecordResult, d.assignResult); } },
            { field: 'createTime', title: '分配时间', width: 165 },
            { field: 'comment', title: '备注', minWidth: 150 } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationAssignRecord, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
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
