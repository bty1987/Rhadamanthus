/** app/js/decoration/decorationBalance.js —— 装修单内决（列表 + 编辑结算金额 makeDecorationBalance） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, cur: null };
    decorationCommon.dateRange('#balanceTime');

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单号', width: 130, templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
            { field: 'village', title: '楼盘', width: 130, templet: function (d) { return d.decoration && d.decoration.house && d.decoration.house.village ? d.decoration.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 90, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 90, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 90, templet: function (d) { return d.decoration && d.decoration.designer ? d.decoration.designer.currentName : ''; } },
            { field: 'salesman', title: '业务员', width: 90, templet: function (d) { return d.decoration && d.decoration.salesman ? d.decoration.salesman.currentName : ''; } },
            { field: 'status', title: '订单状态', width: 90, templet: function (d) { return d.decoration ? decorationCommon.badge(E.status, d.decoration.status) : ''; } },
            { field: 'balanceStatus', title: '内决状态', width: 90, templet: function (d) { return d.decoration ? decorationCommon.badge(E.balanceStatus, d.decoration.balanceStatus, function (k) { return k == 1 ? 'layui-bg-green' : 'layui-bg-gray'; }) : ''; } },
            { field: 'dBalanceTime', title: '内决时间', width: 170, templet: function (d) { return d.decoration ? app.dateFormat(d.decoration.balanceTime) : ''; } },
            { field: 'balance', title: '结算金额', width: 110, templet: function (d) { return app.formatMoney(d.balance); } },
            { field: 'user', title: '结算人', width: 90, templet: function (d) { return d.user ? d.user.currentName : ''; } },
            { field: 'balanceTime', title: '结算时间', width: 170, templet: function (d) { return app.dateFormat(d.balanceTime); } },
            { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'edit') openEdit(obj.data);
    });

    function openEdit(v) {
        state.cur = v;
        $('#orderId').val(v.decoration ? v.decoration.orderId : '');
        $('#balance').val(v.balance);
        state.editIndex = layer.open({ type: 1, title: '编辑结算金额', content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function () { doSave(); } });
    }

    function doSave() {
        if (!state.cur || !state.cur.decoration || !state.cur.decoration.orderId) { app.showAlert(app.warning, '装修单信息不存在'); return; }
        var val = $.trim($('#balance').val());
        if (val === '' || isNaN(parseFloat(val))) { app.showAlert(app.warning, '请输入结算金额'); return; }
        app.post(api.decoration.makeDecorationBalance, { 'decorationBalance.decoration.orderId': state.cur.decoration.orderId, 'decorationBalance.balance': val }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }

    function query(pg) {
        state.page = pg || 1;
        var filters = decorationCommon.buildFilters($('#searchForm'));
        app.post(api.decoration.pageDecorationForBalance, $.extend({}, filters, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
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
