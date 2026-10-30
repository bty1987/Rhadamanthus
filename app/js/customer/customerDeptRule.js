/** app/js/customer/customerDeptRule.js —— 部门规则（旧 customerDeptRule.js → layui）
 *  列表：pageCustomerDeptRule（名称/类型/归属类型检索）。
 *  创建：addCustomerDeptRule（归属类型/部门类型→部门级联/业务类型/聚焦）；删除 deleteCustomerDeptRule。
 *  跨模块：api.communion.queryDepartmentType/ByDtid、api.data.queryDecorationBusitype。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    // personel.dept.status：0=禁用 1=启用（生产库）
    var DEPT_STATUS = { 0: '禁用', 1: '启用' };
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    // 部门类型 → 部门 级联
    app.post(api.communion.queryDepartmentType, {}, function (res) {
        app.bindData($('#deptTypeSel'), res.departmentTypes || [], 'dtid', 'name', true);
        form.render('select');
    });
    form.on('select(deptTypeFilter)', function (obj) {
        loadDept(obj.value);
    });
    function loadDept(dtid) {
        if (!dtid) { $('#deptSel').html('<option value="">全部</option>'); form.render('select'); return; }
        app.post(api.communion.queryDepartmentByDtid, { 'dept.type.dtid': dtid }, function (res) {
            app.bindData($('#deptSel'), res.deptList || res.departments || [], 'did', 'name', true);
            form.render('select');
        });
    }

    // 业务类型
    app.post(api.data.queryDecorationBusitype, {}, function (res) {
        app.bindData($('#busitypeSel'), res.decorationBusitypes || [], 'dbid', 'name', true);
        form.render('select');
    });

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '名称', minWidth: 150 },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return E.deptRuleType[d.type] != null ? E.deptRuleType[d.type] : ''; } },
            { field: 'atttype', title: '归属类型', width: 100, templet: function (d) { return E.deptRuleAtttype[d.atttype] != null ? E.deptRuleAtttype[d.atttype] : ''; } },
            { field: 'busitype', title: '业务类型', width: 110, templet: function (d) { return d.busitype ? (d.busitype.name || '') : ''; } },
            { field: 'department', title: '部门状态', width: 100, templet: function (d) {
                var s = d.department ? d.department.status : null;
                return s != null ? customerCommon.badge(DEPT_STATUS, s) : '';
            } },
            { field: 'focus', title: '聚焦', width: 100, templet: function (d) { return E.deptRuleFocus[d.focus] != null ? E.deptRuleFocus[d.focus] : ''; } },
            { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.customer.deleteCustomerDeptRule, { 'customerDeptRule.cdrid': obj.data.cdrid }, function () {
                app.showAlert(app.success, '操作成功');
                query(state.page);
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-warm layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</button>'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageCustomerDeptRule, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        }), function (res) {
            var p = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '创建部门规则', content: $('#editBox'), area: ['540px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        app.post(api.customer.addCustomerDeptRule, {
            'customerDeptRule.atttype': $('#editForm [name="atttype"]').val(),
            'customerDeptRule.department.did': $('#editForm [name="dept"]').val(),
            'customerDeptRule.busitype.dbid': $('#editForm [name="busitype"]').val(),
            'customerDeptRule.focus': $('#editForm [name="focus"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query(state.page);
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
