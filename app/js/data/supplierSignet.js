/** app/js/data/supplierSignet.js —— 厂商签章（CRUD + 多状态，关联 suid）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'upload', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, upload = layui.upload, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['ssid','no','name','corporation','taxNo','address','phone','bankName','bankNo','keyword','type','path'];
    app.uploadImage({ elem: '#btnUpload', done: function (res) { $('#path').val(res.resUrl || ''); } });
    var ST = { 0: '初始化', 1: '已注册', 2: '已认证', 3: '已签章', 4: '已确认', 5: '已作废' };
    function stB(d) { var c = ''; switch (d.status) { case 0: c = 'layui-bg-gray'; break; case 3: c = 'layui-bg-green'; break; case 5: c = 'layui-bg-red'; break; default: c = 'layui-bg-blue'; } return '<span class="layui-badge ' + c + '">' + (ST[d.status] || d.status) + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'no', title: '编号', width: 120 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'corporation', title: '法人', width: 100 }, { field: 'taxNo', title: '税号', width: 140 }, { field: 'status', title: '状态', width: 100, templet: stB }, { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'cancel') doCancel(obj.data.ssid); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageSupplierSignet, $.extend({}, bF(), { 'signet.suid': $('#searchSuid').val() || 0, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.ssid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); } form.render('select'); state.editIndex = layer.open({ type: 1, title: d ? '编辑签章' : '添加签章', content: $('#editBox'), area: ['560px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = {}; F.forEach(function (k) { o['signet.' + k] = $('#editForm [name="' + k + '"]').val(); }); o['signet.suid'] = $('#searchSuid').val() || 0; var ad; if (state.editId) { o['signet.ssid'] = state.editId; ad = api.data.updateSupplierSignet; } else { delete o['signet.ssid']; ad = api.data.addSupplierSignet; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function doCancel(id) { app.showConfirm('确认作废？', function () { app.post(api.data.cancelSupplierSignet, { 'signet.ssid': id }, function () { app.showAlert(app.success, '已作废'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
