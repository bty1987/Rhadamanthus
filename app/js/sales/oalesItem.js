/** app/js/sales/oalesItem.js —— 外销项明细（列表 + 新增 + 删除）
 * 上下文：app.params.sales.oales = {oid} */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    var ctx = (app.params.sales && app.params.sales.oales) || {};
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '商品名称', width: 200 },
                { field: 'format', title: '规格', width: 140 },
                { field: 'color', title: '颜色', width: 100 },
                { field: 'model', title: '型号', width: 120 },
                { field: 'price', title: '价格(元)', width: 110, templet: function (d) { return app.formatMoney(d.price); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '小计(元)', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 90, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data); });
    }
    function query(pg) {
        state.page = pg || 1;
        if (!ctx.oid) { app.showAlert(app.error, '缺少外销单ID参数'); return; }
        app.post(api.sales.pageOalesItem, $.extend({}, { 'oalesItem.oid': ctx.oid, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openAdd() {
        app.clearValidator(); $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '创建外销项', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.sales.addOalesItem, {
            'oalesItem.oales.oid': ctx.oid,
            'oalesItem.name': $('#editForm [name="name"]').val(),
            'oalesItem.format': $('#editForm [name="format"]').val(),
            'oalesItem.color': $('#editForm [name="color"]').val(),
            'oalesItem.model': $('#editForm [name="model"]').val(),
            'oalesItem.price': $('#editForm [name="price"]').val(),
            'oalesItem.num': $('#editForm [name="num"]').val(),
            'oalesItem.comment': $('#editForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '创建成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function doDel(v) {
        app.showConfirm('确认删除该外销项吗?', function () {
            app.post(api.sales.deleteOalesItem, { 'oalesItem.oiid': v.oiid }, function () { app.showAlert(app.success, '删除成功'); query(state.page); });
        });
    }
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
