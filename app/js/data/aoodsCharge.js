/** app/js/data/aoodsCharge.js —— 辅料费用（增删改查，关联 aoods aid）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['acid','name','price','surplus','type','status','sort'];
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '费用名', minWidth: 160 }, { field: 'price', title: '价格', width: 100, templet: function (d) { return app.formatMoney(d.price); } }, { field: 'surplus', title: '浮动额', width: 100 }, { field: 'type', title: '类型', width: 80 }, { field: 'status', title: '状态', width: 80 }, { field: 'sort', title: '排序', width: 70 }, { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'del') doDel(obj.data.acid); });
    }
    function aid() { return $('#searchAid').val() || 0; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageAoodsCharge, { 'aoodsCharge.aoods.aid': aid(), 'paging.page': state.page, 'paging.rows': state.rows }, function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.acid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); } form.render('select'); state.editIndex = layer.open({ type: 1, title: d ? '编辑费用' : '添加费用', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'aoodsCharge.aoods.aid': aid() }; ['name','price','surplus','type','status','sort'].forEach(function (k) { o['aoodsCharge.' + k] = $('#editForm [name="' + k + '"]').val(); }); var ad; if (state.editId) { o['aoodsCharge.acid'] = state.editId; ad = api.data.updateAoodsCharge; } else { ad = api.data.addAoodsCharge; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteAoodsCharge, { 'aoodsCharge.acid': id }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
