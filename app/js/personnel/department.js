/** department.js —— 部门管理（pageDepartment / addDepartment / updateDepartment / updateDepartmentForStatus）
 * 父页用 ?type=dutment 进入则显示"定岗"按钮，否则显示 编辑/启用禁用/合作 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    state.type = getUrlParam('type') || '';

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }

    loadOptions();
    initTable(); query(1);

    function loadOptions() {
        app.post(api.communion.queryDepartment, {}, function (res) {
            var arr = [];
            $.each(res.deptList || [], function (i, v) { if (v.fatherDept && v.fatherDept.did != null && v.fatherDept.did != v.did) return; arr.push(v); });
            app.bindData($('#editForm [name="fatherDept.did"]'), arr, 'did', 'name', true, function () { form.render('select'); });
        }, null, false);
        app.post(api.communion.queryDepartmentType, {}, function (res) {
            app.bindData($('#editForm [name="type.dtid"]'), res.departmentTypes, 'dtid', 'name', true, function () { form.render('select'); });
        }, null, false);
        app.post(api.data.queryDecorationBusitype, {}, function (res) {
            app.bindData($('#editForm [name="busitype.dbid"]'), res.decorationBusitypes, 'dbid', 'name', true, function () { form.render('select'); });
        }, null, false);
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 100, sort: true },
                { field: 'name', title: '部门名称', minWidth: 160 },
                { field: 'fatherDept', title: '所属分区', width: 140, templet: function (d) { return d.fatherDept && d.fatherDept.name ? d.fatherDept.name : '无'; } },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'kino', title: '金蝶编号', width: 120, templet: function (d) { return d.kino || '无'; } },
                { field: 'manager', title: '管理人员', width: 120, templet: function (d) { return d.manager ? (d.manager.userName || '无') : '无'; } },
                { field: 'isdet', title: '是否定岗', width: 100, templet: function (d) { return d.isdet == 1 ? '<span class="layui-badge layui-bg-blue">定岗</span>' : '<span class="layui-badge">开放</span>'; } },
                { field: 'limit', title: '人员上限', width: 100 },
                { title: '操作', width: 260, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'del') doDelete(obj.data);
            else if (obj.event === 'partner') openPartner(obj.data);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (v === '' || v == null) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.communion.pageDepartment, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage(Math.min(pg.totalPage || 0, 59));
        });
    }
    function renderPage(tp) { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.did;
            $('#editForm [name="did"]').val(d.did);
            $('#editForm [name="no"]').val(d.no);
            $('#editForm [name="name"]').val(d.name);
            if (d.type) $('#editForm [name="type.dtid"]').val(d.type.dtid);
            if (d.busitype && d.busitype.dbid) $('#editForm [name="busitype.dbid"]').val(d.busitype.dbid);
            if (d.fatherDept && d.fatherDept.did) $('#editForm [name="fatherDept.did"]').val(d.fatherDept.did);
            $('#editForm [name="kino"]').val(d.kino);
            $('#editForm [name="kiname"]').val(d.kiname);
            $('#editForm [name="comment"]').val(d.comment);
            $('#editForm [name="isdet"]').val(d.isdet);
            $('#editForm [name="code"]').val(d.code);
            $('#editForm [name="limit"]').val(d.limit);
            form.render('select');
        } else { form.render('select'); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑部门' : '添加部门', content: $('#editBox'), area: ['640px', '90%'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'dept.name': $('#editForm [name="name"]').val(),
            'dept.type.dtid': $('#editForm [name="type.dtid"]').val(),
            'dept.busitype.dbid': $('#editForm [name="busitype.dbid"]').val() || null,
            'dept.fatherDept.did': $('#editForm [name="fatherDept.did"]').val() || null,
            'dept.kino': $('#editForm [name="kino"]').val(),
            'dept.kiname': $('#editForm [name="kiname"]').val(),
            'dept.comment': $('#editForm [name="comment"]').val(),
            'dept.isdet': $('#editForm [name="isdet"]').val(),
            'dept.code': $('#editForm [name="code"]').val(),
            'dept.limit': $('#editForm [name="limit"]').val()
        };
        var apiDef;
        if (state.editId) { opt['dept.did'] = state.editId; apiDef = api.communion.updateDepartment; }
        else { apiDef = api.communion.addDepartment; }
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }

    function doDelete(d) {
        app.showConfirm('是否确定删除该部门？', function () {
            app.post(api.communion.updateDepartmentForStatus, { 'dept.did': d.did, 'dept.status': 1 }, function () { app.showAlert(app.success, '已禁用'); query(state.page); });
        });
    }

    function openPartner(d) {
        var url = '../../views/personnel/departmentPartner.html?did=' + d.did;
        layer.open({ type: 2, title: '部门合作人', content: url, area: ['80%', '80%'] });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
