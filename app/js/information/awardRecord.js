/** app/js/information/awardRecord.js —— 奖品记录（列表 + 查询）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };

    var TYPE_MAP = { 0: '入库', 1: '出库', 2: '盘点' };
    var SUBTYPE_MAP = { 1: '销售出库', 2: '采购入库', 3: '其他出库', 4: '其他入库' };
    var ONETYPE_MAP = { 0: '其他', 1: '活动', 2: '装修' };

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'awardStock', title: '奖品', minWidth: 200, templet: function (d) { return d.awardStock ? d.awardStock.name : ''; } },
                { field: 'orderId', title: '装修单号', width: 150 },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'subtype', title: '子类', width: 110, templet: function (d) { return SUBTYPE_MAP[d.subtype] || '---'; } },
                { field: 'onetype', title: '一类', width: 90, templet: function (d) { return ONETYPE_MAP[d.onetype] || '---'; } },
                { field: 'num', title: '数量', width: 90, align: 'right' },
                { field: 'totalPrice', title: '总价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.totalPrice); } },
                { field: 'unitPrice', title: '单价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.unitPrice); } },
                { field: 'creater', title: '提交人', width: 110, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
                { field: 'operateTime', title: '时间', width: 160 },
                { field: 'content', title: '说明', minWidth: 220 },
                { title: '操作', width: 90, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'detail') { app.showAlert(app.info, obj.data.awardStock ? obj.data.awardStock.name : ''); } });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageAwardRecord, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
