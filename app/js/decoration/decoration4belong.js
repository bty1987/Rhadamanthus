/** app/js/decoration/decoration4belong.js —— 装修单归属（查看→归属信息弹窗；设计/业务→归属变更弹窗） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0 };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单号', width: 130 },
            { field: 'addr', title: '楼盘地址', minWidth: 170, templet: function (d) { var h = d.house || {}; return ((h.village && h.village.name) || '') + ' ' + (h.houseNumber || ''); } },
            { field: 'customer', title: '客户名', width: 90, templet: function (d) { return (d.customer && d.customer.name) || ''; } },
            { field: 'designDept', title: '设计部', width: 120, templet: function (d) { return (d.designer && d.designer.dept && d.designer.dept.name) || ''; } },
            { field: 'designer', title: '设计师', width: 90, templet: function (d) { return (d.designer && d.designer.currentName) || ''; } },
            { field: 'salesDept', title: '业务部', width: 120, templet: function (d) { return (d.salesman && d.salesman.dept && d.salesman.dept.name) || ''; } },
            { field: 'salesman', title: '业务员', width: 90, templet: function (d) { return (d.salesman && d.salesman.currentName) || ''; } },
            { field: 'buildArea', title: '面积', width: 90, templet: function (d) { return (d.house && d.house.buildArea) || ''; } },
            { field: 'orderTotalPrice', title: '合同报价', width: 110, templet: function (d) { return app.formatMoney(d.orderTotalPrice); } },
            { field: 'measureTime', title: '量房时间', width: 110, templet: function (d) { return (d.measureTime || '').substring(0, 10); } },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return E.typeness[d.type] || ''; } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.status, d.status); } },
            { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'look') { app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId }); app.popup(api.index.decorationBelongInfoIndex.url, '装修单归属: ' + v.orderId); }
        else if (ev === 'design') { openBelong(v.orderId, 0); }
        else if (ev === 'salesman') { openBelong(v.orderId, 1); }
    });

    function openBelong(orderId, type) {
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: orderId, orderBelongType: type });
        app.popup(api.index.decorationBelongDetailIndex.url, (type == 0 ? '装修单设计归属: ' : '装修单业务归属: ') + orderId);
    }

    function query(pg) {
        state.page = pg || 1;
        var filters = decorationCommon.buildFilters($('#searchForm'));
        app.post(api.decoration.pageDecorationForBelong, $.extend({}, filters, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
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
