/** app/js/data/normadd.js —— 定额附加项（CRUD + 状态 + 删除）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['naid','name','cnid','unit','price'];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'constructionNode', title: '节点', width: 140, templet: function (d) { return d.constructionNode ? d.constructionNode.name : ''; } }, { field: 'unit', title: '单位', width: 80 }, { field: 'price', title: '单价', width: 100, templet: function (d) { return app.formatMoney(d.price); } }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 280, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updSt(obj.data.naid, 0); else if (obj.event === 'disable') updSt(obj.data.naid, 1); else if (obj.event === 'del') doDel(obj.data.naid); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageNormadd, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.naid; $('#editForm [name="naid"]').val(d.naid); $('#editForm [name="name"]').val(d.name || ''); $('#editForm [name="cnid"]').val(d.constructionNode ? d.constructionNode.cnid : ''); $('#editForm [name="unit"]').val(d.unit || ''); $('#editForm [name="price"]').val(d.price != null ? d.price : ''); } state.editIndex = layer.open({ type: 1, title: d ? '编辑' : '添加', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'normadd.name': $('#editForm [name="name"]').val(), 'normadd.constructionNode.cnid': $('#editForm [name="cnid"]').val(), 'normadd.unit': $('#editForm [name="unit"]').val(), 'normadd.price': $('#editForm [name="price"]').val() }; var ad; if (state.editId) { o['normadd.naid'] = state.editId; ad = api.data.updateNormadd; } else { ad = api.data.addNormadd; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function updSt(id, s) { app.post(api.data.updateNormaddForStatus, { 'normadd.naid': id, 'normadd.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteNormadd, { 'normadd.naid': id }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
