/** app/js/material/materialBrandRight.js —— 主材品牌权限（按用户分配品牌）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'userId', title: '用户ID', width: 100 }, { field: 'userName', title: '用户名', minWidth: 160 }, { field: 'brandright', title: '品牌权限', minWidth: 320 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.material.queryMaterialBrandRight, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; var list = p.data || res.materialBrandRights || []; table.reload('resultTable', { data: list }); state.total = p.totalRecords || list.length; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset();
        state.editId = d.userId;
        $('#editForm [name="userId"]').val(d.userId);
        $('#editForm [name="userNameShow"]').val(d.userName);
        $('#editForm [name="brandright"]').val(d.brandright || '');
        state.editIndex = layer.open({ type: 1, title: '编辑品牌权限 - ' + d.userName, content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var o = {};
        o['materialBrandRight.userId'] = state.editId;
        o['materialBrandRight.brandright'] = $('#editForm [name="brandright"]').val();
        app.post(api.material.updateMaterialBrandRight, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
