/** app/js/quotation/selectionIndex.js —— 选材单列表
 *  配置：queryQuotationFunctionRight(depage,4)（默认 pageSelection）；
 *  行操作：查看（selectionPart）、锁定 lockSelection、解锁 unlockSelection、重置 resetSelection。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var pageConfig = qc.getPageConfig(urlLoad.depage, 4);
    if (!pageConfig.apiPage) pageConfig.apiPage = api.quotation.pageSelection;
    var state = { page: 1, rows: 10, total: 0 };
    function hasBtn(n) { return (pageConfig.pageBtn || []).indexOf(n) != -1; }

    quotationCommon.dateRange('#createTime');
    var D = function (d, f) { return d.decoration ? d.decoration[f] : ''; };
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'decoration', title: '装修单号', width: 110, fixed: 'left', templet: function (d) { return D(d, 'orderId'); } },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) { return d.decoration && d.decoration.house && d.decoration.house.village ? d.decoration.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.houseNumber : ''; } },
            { field: 'customer', title: '客户名', width: 90, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 90, templet: function (d) { return d.decoration && d.decoration.designer ? d.decoration.designer.currentName : ''; } },
            { field: 'salesman', title: '业务员', width: 90, templet: function (d) { return d.decoration && d.decoration.salesman ? d.decoration.salesman.currentName : ''; } },
            { field: 'creater', title: '创建人', width: 90, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
            { field: 'createTime', title: '创建时间', width: 160 },
            { field: 'affirmTime', title: '确认时间', width: 160 },
            { field: 'total', title: '总额', width: 100, templet: function (d) { return qc.money(d.total); } },
            { field: 'quotationTotal', title: '报价总额', width: 100, templet: function (d) { return qc.money(d.quotationTotal); } },
            { field: 'extensionAddTotal', title: '拓展增总额', width: 105, templet: function (d) { return qc.money(d.extensionAddTotal); } },
            { field: 'extensionReduceTotal', title: '拓展减总额', width: 105, templet: function (d) { return qc.money(d.extensionReduceTotal); } },
            { field: 'addReduceAddTotal', title: '增减增总额', width: 105, templet: function (d) { return qc.money(d.addReduceAddTotal); } },
            { field: 'addReduceMinusTotal', title: '增减减总额', width: 105, templet: function (d) { return qc.money(d.addReduceMinusTotal); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge(E.selectionStatus, d.status); } },
            { field: 'isAffirm', title: '确认状态', width: 90, templet: function (d) { return E.selectionIsAffirm[d.isAffirm] != null ? E.selectionIsAffirm[d.isAffirm] : ''; } },
            { title: '操作', width: 230, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        var opts = $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows });
        $.each(pageConfig.extraParam || [], function (i, v) { opts['statusas[' + i + ']'] = v; });
        app.post(pageConfig.apiPage, opts, function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'view' && hasBtn('view')) {
            app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.decoration.orderId, selection: v });
            app.params.historyPage = api.index.selectionIndex.url;
            app.switchPage(api.index.selectionPartIndex.url);
        } else if (obj.event === 'lock' && hasBtn('lock')) {
            app.post(api.quotation.lockSelection, { 'selection.qid': v.qid }, function () { app.showAlert(app.info, '锁定成功'); query(state.page); });
        } else if (obj.event === 'unlock' && hasBtn('unlock')) {
            app.post(api.quotation.unlockSelection, { 'selection.qid': v.qid }, function () { app.showAlert(app.info, '解锁成功'); query(state.page); });
        } else if (obj.event === 'reset' && hasBtn('reset')) {
            app.showConfirm('是否确认重置选材单?', function () {
                app.post(api.quotation.resetSelection, { 'selection.qid': v.qid }, function () { query(state.page); });
            });
        }
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
