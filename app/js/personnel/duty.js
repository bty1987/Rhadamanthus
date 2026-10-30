/** duty.js —— 职位管理（pageDuty / addDuty / updateDuty / updateDutyForStatus） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null, currentUid: null };

        loadDeptType();
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[{"field":"name","title":"职位名称","minWidth":180},{"field":"departmentType","title":"部门类型","width":160},{"field":"lead","title":"主管","width":100},{"title":"操作","width":280,"fixed":"right","toolbar":"#rowToolbar"}]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event;
            if (ev === 'edit') openEdit(obj.data);
            if (ev === 'dutment') openDutment(obj.data);
            if (ev === 'status') toggleStatus(obj.data);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.system.pageDuty, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage(Math.min(pg.totalPage || 0, 59));
        });
    }
    function renderPage(totalPage) { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function loadDeptType() {
        app.post(api.communion.queryDepartmentType, {}, function (res) {
            var html = '<option value="">请选择部门类型</option>';
            $.each(res.departmentTypes || [], function (i, v) { html += '<option value="' + v.dtid + '">' + v.name + '</option>'; });
            $('#editForm [name="departmentType.dtid"]').html(html); form.render('select');
        }, null, false);
    }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.did;
            $('#editForm [name="did"]').val(d.did);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="code"]').val(d.code);
            $('#editForm [name="lead"]').val(d.lead);
            if (d.departmentType) $('#editForm [name="departmentType.dtid"]').val(d.departmentType.dtid);
            form.render('select');
        } else { form.render('select'); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑职位' : '添加职位', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'duty.name': $('#editForm [name="name"]').val(),
            'duty.code': $('#editForm [name="code"]').val(),
            'duty.lead': $('#editForm [name="lead"]').val(),
            'duty.departmentType.dtid': $('#editForm [name="departmentType.dtid"]').val(),
            'duty.type': 0, 'duty.pinyin': ''
        };
        var apiDef = state.editId ? (opt['duty.did'] = state.editId, api.system.updateDuty) : api.system.addDuty;
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }

    function openDutment(d) {
        var url = '../../views/personnel/dutment.html?did=' + d.did + '&type=1&typeId=' + (d.departmentType ? d.departmentType.dtid : '');
        layer.open({ type: 2, title: '定岗信息', content: url, area: ['80%', '80%'] });
    }

    function toggleStatus(d) {
        var ns = d.status == 0 ? 1 : 0;
        app.post(api.system.updateDutyForStatus, { 'duty.did': d.did, 'duty.status': ns }, function () { query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

});
}); // end app.ready
