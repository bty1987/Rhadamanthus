/** app/js/store/muser.js —— 商城用户（列表 + 编辑）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };
    laydate.render({ elem: '#birthday', type: 'date', format: 'yyyy-MM-dd' });
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '昵称', minWidth: 140 },
                { field: 'phone', title: '手机号', width: 140 },
                { field: 'gender', title: '性别', width: 80, templet: function (d) { return d.gender === true ? '男' : d.gender === false ? '女' : '未知'; } },
                { field: 'birthday', title: '生日', width: 120, templet: function (d) { return app.dateFormat(d.birthday, 'yyyy-MM-dd'); } },
                { field: 'unionId', title: 'UnionID', minWidth: 160 },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.store.pageMuser, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        $('#editForm')[0].reset();
        if (d) { ['unionId','name','phone','gender','birthday'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '编辑用户', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        var opt = { 'muser.unionId': $('#editForm [name="unionId"]').val(), 'muser.name': $('#editForm [name="name"]').val(), 'muser.phone': $('#editForm [name="phone"]').val(), 'muser.gender': $('#editForm [name="gender"]').val(), 'muser.birthday': $('#editForm [name="birthday"]').val() };
        app.post(api.store.updateMuser, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
