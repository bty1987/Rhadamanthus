/** app/js/data/decorationMeasureRule.js —— 测量规则（CRUD + 状态 + 删除）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['drid','name','ruleContent'];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'ruleContent', title: '规则内容', minWidth: 240 }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 280, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updSt(obj.data.drid, 0); else if (obj.event === 'disable') updSt(obj.data.drid, 1); else if (obj.event === 'del') doDel(obj.data.drid); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageDecorationMeasureRule, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.drid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); } state.editIndex = layer.open({ type: 1, title: d ? '编辑规则' : '添加规则', content: $('#editBox'), area: ['520px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = {}; F.forEach(function (k) { o['decorationMeasureRule.' + k] = $('#editForm [name="' + k + '"]').val(); }); var ad; if (state.editId) { o['decorationMeasureRule.drid'] = state.editId; ad = api.data.updateDecorationMeasureRule; } else { delete o['decorationMeasureRule.drid']; ad = api.data.addDecorationMeasureRule; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function updSt(id, s) { app.post(api.data.updateDecorationMeasureRuleForStatus, { 'decorationMeasureRule.drid': id, 'decorationMeasureRule.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    function doDel(id) { app.showConfirm('确认删除？', function () { app.post(api.data.deleteDecorationMeasureRule, { 'decorationMeasureRule.drid': id }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
