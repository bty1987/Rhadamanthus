/** app/js/quotation/normtionIndex.js —— 定额单列表
 *  配置：queryQuotationFunctionRight(depage,7)；默认 pageNormtion；
 *  行操作：查看（normtionPart，传 orderId+quotation）、状态 updateNormtionForStatus。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var pageConfig = qc.getPageConfig(urlLoad.depage, 7);
    if (!pageConfig.apiPage) pageConfig.apiPage = api.quotation.pageNormtion;
    var state = { page: 1, rows: 10, total: 0 };
    function hasBtn(n) { return (pageConfig.pageBtn || []).indexOf(n) != -1; }

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
            { field: 'moodTotal', title: '材料总额', width: 100, templet: function (d) { return qc.money(d.moodTotal); } },
            { field: 'moodPrintNum', title: '材料打印次数', width: 110 },
            { field: 'mricePriceNum', title: '工费打印次数', width: 110 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '启用', 1: '禁用' }, d.status); } },
            { title: '操作', width: 160, toolbar: '#rowToolbar', fixed: 'right' } ]] });

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
            app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.decoration.orderId, quotation: v });
            app.params.historyPage = api.index.normIndex.url;
            app.switchPage(api.index.normPart.url);
        } else if (obj.event === 'status' && hasBtn('btnStatus')) {
            app.post(api.quotation.updateNormtionForStatus, { 'normtion.nid': v.nid, 'normtion.status': v.status == 0 ? 1 : 0 }, function () { query(state.page); });
        }
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    query(1);
});
}); // end app.ready
