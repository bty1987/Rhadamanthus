/** app/js/manifest/manifestTemplate.js —— 货单模板（列表 + 增改 + 启用/禁用/删除 + 绑定）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'comment', title: '说明', minWidth: 200 }, { field: 'status', title: '状态', width: 90, templet: stB }, { title: '操作', width: 380, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'edit') openEdit(d);
            else if (e === 'bind') app.switchPage('manifestTemplateItem.html?mtid=' + d.mtid);
            else if (e === 'enable') updSt(d.mtid, 0);
            else if (e === 'disable') updSt(d.mtid, 1);
            else if (e === 'del') app.showConfirm('是否确定删除', function () { app.post(api.inventory.deleteManifestTemplate, { 'manifestTemplate.mtid': d.mtid }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); });
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.inventory.pageManifestTemplate, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset();
        if (d) { $('#editForm [name="mtid"]').val(d.mtid); $('#editForm [name="name"]').val(d.name); $('#editForm [name="comment"]').val(d.comment || ''); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑模板' : '添加模板', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var mtid = $('#editForm [name="mtid"]').val();
        var opt = { 'manifestTemplate.name': $('#editForm [name="name"]').val(), 'manifestTemplate.comment': $('#editForm [name="comment"]').val() };
        var def;
        if (mtid) { opt['manifestTemplate.mtid'] = mtid; def = api.inventory.updateManifestTemplate; } else { def = api.inventory.addManifestTemplate; }
        app.post(def, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function updSt(id, s) { app.post(api.inventory.updateManifestTemplateForStatus, { 'manifestTemplate.mtid': id, 'manifestTemplate.status': s }, function () { query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    form.render();
});
}); // end app.ready
