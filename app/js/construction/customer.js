/** app/js/construction/customer.js —— 客服工程列表
 *  pageConfig：name='customer'。行按钮：施工节点（弹 customer4detail 客户评分详情页）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var pageConfig = constructionCommon.getPageConfig('customer');
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
            { field: 'orderTotalPrice', title: '总价', width: 95, templet: function (d) { return money(d.orderTotalPrice); } },
            { field: 'buildArea', title: '面积', width: 80, templet: function (d) { return d.house ? d.house.buildArea : ''; } },
            { field: 'version', title: '报价版本', width: 90, templet: function (d) { return d.version ? d.version.name : ''; } },
            { field: 'projectStatus', title: '进度', width: 90, templet: function (d) { return constructionCommon.badge({ 0: '初始', 1: '开工', 2: '完工' }, d.projectStatus); } },
            { title: '操作', width: 120, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'view' && btnVisible('view')) {
            var v = obj.data;
            app.params.construction = $.extend({}, app.params.construction, { orderId: v.orderId });
            app.popup('views/construction/customer4detail.html', '查看', null, { area: ['90%', '90%'] });
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
