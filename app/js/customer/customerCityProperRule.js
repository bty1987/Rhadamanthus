/** app/js/customer/customerCityProperRule.js —— 城区规则（旧 customerCityProperRule.js → layui）
 *  列表：pageCustomerCityProperRule（类型/状态检索）。
 *  添加：addCustomerCityProperRule（类型分支：0目标公司/1部门/2设计师）；删除 deleteCustomerCityProperRule。
 *  跨模块：api.system.queryCompany/queryCity/queryCityProperByCid、api.data.queryDecorationBusitype、api.communion 部门。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var TYPE_MAP = { 0: '城区→公司', 1: '城区→部门', 2: '城区→设计师' };
    var STATUS_MAP = { 0: '启用', 1: '禁用' };
    var state = { page: 1, rows: 10, total: 0, editIndex: null, userUid: null };

    // 公司（atttype=1）/ 业务类型 / 城市
    app.post(api.system.queryCompany, { 'company.atttype': '1' }, function (res) {
        app.bindData($('#companySel'), res.companys || [], 'cid', 'name', true);
        app.bindData($('#targetCompanySel'), res.companys || [], 'cid', 'name', true);
        form.render('select');
    }, null, false);
    app.post(api.data.queryDecorationBusitype, {}, function (res) {
        app.bindData($('#busitypeSel'), res.decorationBusitypes || [], 'dbid', 'name', true);
        form.render('select');
    }, null, false);
    app.post(api.system.queryCity, {}, function (res) {
        app.bindData($('#citySel'), res.citys || [], 'cid', 'name', true);
        form.render('select');
    }, null, false);

    // 城市 → 城区级联
    form.on('select(cityFilter)', function (obj) {
        $('#cityProperSel').html('<option value="">请选择城区</option>');
        if (obj.value) {
            app.post(api.system.queryCityProperByCid, { 'cityProper.city.cid': obj.value }, function (res) {
                app.bindData($('#cityProperSel'), res.cityPropers || [], 'cpid', 'name', true);
                form.render('select');
            });
        } else {
            form.render('select');
        }
    });

    // 部门下拉（部门规则用，部门类型 0）
    app.post(api.communion.queryDepartmentByDtid, { 'dept.type.dtid': 0 }, function (res) {
        app.bindData($('#deptSel'), res.deptList || res.departments || [], 'did', 'name', true);
        form.render('select');
    });

    // 类型切换
    form.on('select(typeFilter)', function (obj) {
        var type = parseInt(obj.value, 10);
        $('.targetCompanyGroup').hide(); $('.deptGroup').hide(); $('.userGroup').hide();
        if (type === 0) $('.targetCompanyGroup').show();
        else if (type === 1) $('.deptGroup').show();
        else if (type === 2) $('.userGroup').show();
    });

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'type', title: '类型', width: 120, templet: function (d) { return TYPE_MAP[d.type] != null ? TYPE_MAP[d.type] : ''; } },
            { field: 'city', title: '城区', width: 120, templet: function (d) { return d.city ? (d.city.name || '') : ''; } },
            { field: 'busitype', title: '业务类型', width: 100, templet: function (d) { return d.busitype ? (d.busitype.name || '') : ''; } },
            { field: 'targetCompany', title: '目标公司', width: 140, templet: function (d) { return d.type == 0 && d.targetCompany ? (d.targetCompany.name || '') : ''; } },
            { field: 'department', title: '部门', width: 130, templet: function (d) { return d.type == 1 && d.department ? (d.department.name || '') : ''; } },
            { field: 'user', title: '设计师', width: 110, templet: function (d) { return d.type == 2 && d.user ? (d.user.currentName || '') : ''; } },
            { field: 'priority', title: '优先级', width: 80 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(STATUS_MAP, d.status, function (k) { return parseInt(k, 10) === 0 ? 'layui-bg-green' : 'layui-bg-gray'; }); } },
            { field: 'comment', title: '备注', minWidth: 140 },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.showConfirm('确认删除该规则吗？', function () {
                app.post(api.customer.deleteCustomerCityProperRule, { 'customerCityProperRule.ccrrid': obj.data.ccrid }, function () {
                    app.showAlert(app.success, '操作成功');
                    query(state.page);
                });
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</button>'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageCustomerCityProperRule, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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
        state.userUid = null;
        $('#editForm [name="priority"]').val('0');
        $('.targetCompanyGroup').show(); $('.deptGroup').hide(); $('.userGroup').hide();
        state.editIndex = layer.open({ type: 1, title: '添加城区规则', content: $('#editBox'), area: ['560px', 'auto'] });
    });
    $('#btnPickUser').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.userUid = u.userId;
            $('#userName').val(u.currentName);
        });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        var options = {
            'customerCityProperRule.city.cpid': $('#editForm [name="cityProper"]').val(),
            'customerCityProperRule.company.cid': $('#editForm [name="company"]').val(),
            'customerCityProperRule.type': $('#editForm [name="type"]').val(),
            'customerCityProperRule.priority': $('#editForm [name="priority"]').val(),
            'customerCityProperRule.status': $('#editForm [name="status"]').val(),
            'customerCityProperRule.comment': $('#editForm [name="comment"]').val()
        };
        if ($('#editForm [name="busitype"]').val()) {
            options['customerCityProperRule.busitype.dbid'] = $('#editForm [name="busitype"]').val();
        }
        var type = parseInt($('#editForm [name="type"]').val(), 10);
        if (type === 0) options['customerCityProperRule.targetCompany.cid'] = $('#editForm [name="targetCompany"]').val();
        else if (type === 1) options['customerCityProperRule.department.did'] = $('#editForm [name="dept"]').val();
        else if (type === 2) {
            if (!state.userUid) { app.showAlert(app.warning, '请选择设计师'); return; }
            options['customerCityProperRule.user.uid'] = state.userUid;
        }
        app.post(api.customer.addCustomerCityProperRule, options, function () {
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
