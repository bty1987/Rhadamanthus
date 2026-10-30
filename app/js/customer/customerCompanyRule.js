/** app/js/customer/customerCompanyRule.js —— 公司规则（旧 customerCompanyRule.js → layui）
 *  列表：pageCustomerCompanyRule（类型/起始值/终止值检索，金额÷1000）。
 *  添加：addCustomerCompanyRule（类型/公司/部门类型→部门级联/起止值 ×1000）；删除 deleteCustomerCompanyRule。
 *  跨模块：api.communion.queryDepartmentType/ByDtid、api.system.queryCompany(atttype=1)。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    // 公司下拉（atttype=1）
    app.post(api.system.queryCompany, { 'company.atttype': '1' }, function (res) {
        app.bindData($('#companySel'), res.companys || [], 'cid', 'name', true);
        form.render('select');
    });

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

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return E.companyRuleType[d.type] != null ? E.companyRuleType[d.type] : ''; } },
            { field: 'company', title: '公司', width: 160, templet: function (d) { return d.company ? (d.company.name || '') : ''; } },
            { field: 'dept', title: '部门', width: 160, templet: function (d) { return d.dept && d.dept.name ? d.dept.name : ''; } },
            { field: 'uppval', title: '起始值', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.uppval); } },
            { field: 'lowval', title: '终止值', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.lowval); } },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.customer.deleteCustomerCompanyRule, { 'customerCompanyRule.ccrid': obj.data.ccrid }, function () {
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
        app.post(api.customer.pageCustomerCompanyRule, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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
        state.editIndex = layer.open({ type: 1, title: '添加公司规则', content: $('#editBox'), area: ['520px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        app.post(api.customer.addCustomerCompanyRule, {
            'customerCompanyRule.type': $('#editForm [name="type"]').val(),
            'customerCompanyRule.uppval': $('#editForm [name="uppval"]').val(),
            'customerCompanyRule.lowval': $('#editForm [name="lowval"]').val(),
            'customerCompanyRule.company.cid': $('#editForm [name="company"]').val(),
            'customerCompanyRule.dept.did': $('#editForm [name="dept"]').val()
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
