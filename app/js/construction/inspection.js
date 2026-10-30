/** app/js/construction/inspection.js —— 巡检工程列表
 *  pageConfig：name='inspection'。行按钮：记录（跳转巡检记录页 inspection4record）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('inspection');
    var nodeMap = constructionCommon.loadNodeMap();
    var state = { page: 1, rows: 10, total: 0 };

    if (!pageConfig.apiPage) pageConfig.apiPage = api.construction.pageConstruction;
    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    function money(v) { return app.formatMoney(v); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 115, fixed: 'left' },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) { return d.house && d.house.village ? d.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.house ? d.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 80, templet: function (d) { return d.customer ? d.customer.name : ''; } },
            { field: 'designerDept', title: '设计部门', width: 100, templet: function (d) { return d.designer && d.designer.dept ? d.designer.dept.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d) { return d.designer ? d.designer.currentName : ''; } },
            { field: 'supervisor', title: '监理', width: 80, templet: function (d) { return d.supervisor ? d.supervisor.currentName : ''; } },
            { field: 'buildArea', title: '面积', width: 80, templet: function (d) { return d.house ? d.house.buildArea : ''; } },
            { field: 'orderTotalPrice', title: '合同额', width: 95, templet: function (d) { return money(d.orderTotalPrice); } },
            { field: 'version', title: '报价版本', width: 90, templet: function (d) { return d.version ? d.version.name : ''; } },
            { field: 'projectStatus', title: '进度', width: 100, templet: function (d) { var t = constructionCommon.projectStatusName(nodeMap, d.projectStatus); return t != '' ? t : '-'; } },
            { title: '操作', width: 120, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'view') {
            var v = obj.data;
            app.params.construction = $.extend({}, app.params.construction, {
                orderId: v.orderId,
                orderAddr: v.house && v.house.village ? (v.house.village.name + ' ' + (v.house.houseNumber || '')) : ''
            });
            app.switchPage(api.index.inspectionRecordIndex.url);
        }
    });

    function query(pg) {
        state.page = pg || 1;
        app.post(pageConfig.apiPage, $.extend({}, constructionCommon.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
