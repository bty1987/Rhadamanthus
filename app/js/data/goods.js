/** app/js/data/goods.js —— 商品管理（CRUD + 状态）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['gid','no','name','barcode','category','brand','measurementUnit','purchase','selling','confine','pieceNum','comment'];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'no', title: '编号', width: 120 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'barcode', title: '条码', width: 140 }, { field: 'category', title: '品类', width: 100, templet: function (d) { return d.category ? d.category.categoryName : ''; } }, { field: 'brand', title: '品牌', width: 100, templet: function (d) { return d.brand ? d.brand.name : ''; } }, { field: 'purchase', title: '控价', width: 90, templet: function (d) { return app.formatMoney(d.purchase); } }, { field: 'selling', title: '售价', width: 90, templet: function (d) { return app.formatMoney(d.selling); } }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updSt(obj.data.gid, 0); else if (obj.event === 'disable') updSt(obj.data.gid, 1); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageGoods, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.gid; $('#editForm [name="gid"]').val(d.gid); $('#editForm [name="no"]').val(d.no || ''); $('#editForm [name="name"]').val(d.name || ''); $('#editForm [name="barcode"]').val(d.barcode || ''); $('#editForm [name="category"]').val(d.category ? d.category.categoryName : ''); $('#editForm [name="brand"]').val(d.brand ? d.brand.name : ''); $('#editForm [name="measurementUnit"]').val(d.measurementUnit ? d.measurementUnit.name : ''); $('#editForm [name="purchase"]').val(d.purchase != null ? d.purchase : ''); $('#editForm [name="selling"]').val(d.selling != null ? d.selling : ''); $('#editForm [name="confine"]').val(d.confine != null ? d.confine : ''); $('#editForm [name="pieceNum"]').val(d.pieceNum != null ? d.pieceNum : ''); $('#editForm [name="comment"]').val(d.comment || ''); } state.editIndex = layer.open({ type: 1, title: d ? '编辑商品' : '添加商品', content: $('#editBox'), area: ['560px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'goods.no': $('#editForm [name="no"]').val(), 'goods.name': $('#editForm [name="name"]').val(), 'goods.barcode': $('#editForm [name="barcode"]').val(), 'goods.purchase': $('#editForm [name="purchase"]').val(), 'goods.selling': $('#editForm [name="selling"]').val(), 'goods.confine': $('#editForm [name="confine"]').val(), 'goods.pieceNum': $('#editForm [name="pieceNum"]').val(), 'goods.comment': $('#editForm [name="comment"]').val() }; var ad; if (state.editId) { o['goods.gid'] = state.editId; ad = api.data.updateGoods; } else { ad = api.data.addGoods; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function updSt(id, s) { app.post(api.data.updateGoodsForStatus, { 'goods.gid': id, 'goods.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
