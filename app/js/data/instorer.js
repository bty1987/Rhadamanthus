/** app/js/data/instorer.js —— 驻店账号（CRUD + 登录）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['uid','loginId','userName','phone'];
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'userId', title: '编号', width: 100 }, { field: 'loginId', title: '登录名', width: 140 }, { field: 'userName', title: '名称', minWidth: 140 }, { field: 'phone', title: '电话', width: 140 }, { field: 'isLogin', title: '登录状态', width: 90, templet: function (d) { return d.isLogin == 0 ? '<span class="layui-badge layui-bg-gray">禁用<\/span>' : '<span class="layui-badge layui-bg-green">启用<\/span>'; } }, { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'login') app.post(api.data.updateInstorerForLogin, { 'instorer.uid': obj.data.uid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageInstorer, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.uid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); } state.editIndex = layer.open({ type: 1, title: d ? '编辑账号' : '添加账号', content: $('#editBox'), area: ['480px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = { 'instorer.loginId': $('#editForm [name="loginId"]').val(), 'instorer.userName': $('#editForm [name="userName"]').val(), 'instorer.phone': $('#editForm [name="phone"]').val() }; var pwd = $('#editForm [name="password"]').val(); if (pwd) o['instorer.password'] = pwd; var ad; if (state.editId) { o['instorer.uid'] = state.editId; ad = api.data.updateInstorer; } else { ad = api.data.addInstorer; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
