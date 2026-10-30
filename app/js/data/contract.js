/** app/js/data/contract.js —— 合同管理（CRUD + 状态）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'upload', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, upload = layui.upload, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['cid','no','name','title','page','path','videopath','noticePath','atttype'];
    app.uploadImage({ elem: '#btnUpload', accept: 'file', exts: 'pdf', done: function (res) { $('#path').val(res.resUrl || ''); } });
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'no', title: '编号', width: 120 }, { field: 'name', title: '名称', minWidth: 140 }, { field: 'title', title: '标题', minWidth: 160 }, { field: 'atttype', title: '业务类型', width: 100 }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updSt(obj.data.cid, 0); else if (obj.event === 'disable') updSt(obj.data.cid, 1); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageContract, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.cid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); } form.render('select'); state.editIndex = layer.open({ type: 1, title: d ? '编辑合同' : '添加合同', content: $('#editBox'), area: ['560px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = {}; F.forEach(function (k) { o['contract.' + k] = $('#editForm [name="' + k + '"]').val(); }); var ad; if (state.editId) { o['contract.cid'] = state.editId; ad = api.data.updateContract; } else { delete o['contract.cid']; ad = api.data.addContract; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function updSt(id, s) { app.post(api.data.updateContractForStatus, { 'contract.cid': id, 'contract.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
