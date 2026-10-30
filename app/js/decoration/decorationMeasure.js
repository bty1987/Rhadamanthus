/** app/js/decoration/decorationMeasure.js —— 放线排期（drawLine 队列）
 *  pageDecorationMeasure（status=0 排队）+ 查询条件；量房单 → 旧 quotation 量房单弹页。
 *  操作：量房单 → app.params.quotation.orderId + popup（qeasure4detail 页面若已迁移则打开，否则提示）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0 };
    decorationCommon.dateRange('#actualDate');

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单', width: 130, templet: function (d) { return d.decoration.orderId; } },
            { field: 'village', title: '楼盘', width: 120, templet: function (d) { return d.decoration.house.village.name; } },
            { field: 'houseNumber', title: '楼号', width: 90, templet: function (d) { return d.decoration.house.houseNumber; } },
            { field: 'customer', title: '客户', width: 90, templet: function (d) { return (d.decoration.customer && d.decoration.customer.name) || ''; } },
            { field: 'designer', title: '设计师', width: 90, templet: function (d) { return (d.decoration.designer && d.decoration.designer.currentName) || ''; } },
            { field: 'supervisor', title: '监理', width: 90, templet: function (d) { return d.decoration.supervisor ? d.decoration.supervisor.currentName : ''; } },
            { field: 'buildArea', title: '面积', width: 90, templet: function (d) { return d.decoration.house.buildArea; } },
            { field: 'orderTotalPrice', title: '合同额', width: 100, templet: function (d) { return app.formatMoney(d.decoration.orderTotalPrice); } },
            { field: 'typeness', title: '装修业务', width: 90, templet: function (d) { return E.typeness[d.decoration.typeness] || ''; } },
            { field: 'status', title: '装修状态', width: 90, templet: function (d) { return decorationCommon.badge(E.status, d.decoration.status); } },
            { field: 'version', title: '报价版本', width: 100, templet: function (d) { return (d.decoration.version && d.decoration.version.name) || ''; } },
            { field: 'appler', title: '申请人', width: 90, templet: function (d) { return (d.appler && d.appler.currentName) || ''; } },
            { field: 'actualTime', title: '量尺时间', width: 170, templet: function (d) { return app.dateFormat(d.actualTime); } },
            { field: 'startTime', title: '开始时间', width: 80, templet: function (d) { return v_time(d.startTime); } },
            { field: 'endTime', title: '结束时间', width: 80, templet: function (d) { return v_time(d.endTime); } },
            { field: 'content', title: '描述', minWidth: 140 },
            { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });

    function v_time(t) { return t != null ? ('' + t).substr(11) : ''; }

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'qeasure') {
            app.params.quotation = $.extend({}, app.params.quotation, { orderId: obj.data.decoration.orderId });
            if (api.index.qeasure4detailIndex) {
                app.popup(api.index.qeasure4detailIndex.url, '量房单');
            } else {
                app.showAlert(app.info, '量房单页面属于报价模块，待 quotation 模块迁移后开放');
            }
        }
    });

    function query(pg) {
        state.page = pg || 1;
        var filters = decorationCommon.buildFilters($('#searchForm'));
        app.post(api.decoration.pageDecorationMeasure, $.extend({}, filters, { 'decorationMeasure.status': 0, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    $('#btnSearch').on('click', function () { query(1); });
    query(1);
});
}); // end app.ready
