/** departmentType.js —— 部门类型管理（pageDepartmentType / addDepartmentType） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'dtid', title: '编号', width: 80 },
                { field: 'name', title: '类型名称', minWidth: 200 },
                { title: '操作', width: 120, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'del') doDelete(obj.data);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.communion.pageDepartmentType, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage(Math.min(pg.totalPage || 0, 59));
        });
    }
    function renderPage(totalPage) { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加部门类型', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.communion.addDepartmentType, { 'departmentType.name': $('#editForm [name="name"]').val() }, function () {
            app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }
    function doDelete(d) {
        app.showConfirm('是否确定删除该部门类型？', function () {
            app.post(api.communion.deleteDepartmentType, { 'departmentType.dtid': d.dtid }, function () { app.showAlert(app.success, '已删除'); query(state.page); });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
