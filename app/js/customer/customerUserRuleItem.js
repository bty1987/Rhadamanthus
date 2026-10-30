/** app/js/customer/customerUserRuleItem.js —— 人员规则项目（旧 customerUserRuleItem.js → layui）
 *  上下文：app.params.customer.curid。列表：queryCustomerUserRuleItem（金额÷1000）。
 *  添加：addCustomerUserRuleItem（类型分支显示 公司/部门类型/部门/城市城区/起止值/机会数）；删除 deleteCustomerUserRuleItem。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var curid = customerCommon.ctx('customer').curid;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    if (curid == null || curid === '') { app.showAlert(app.warning, '缺少人员规则上下文'); return; }

    laydate.render({ elem: '#handleTime', type: 'datetime' });

    // 公司 / 部门类型 / 部门 / 城市 / 城区
    app.post(api.system.queryCompany, { 'company.atttype': '1' }, function (res) {
        app.bindData($('#companySel'), res.companys || [], 'cid', 'name', true);
        form.render('select');
    }, null, false);
    app.post(api.communion.queryDepartmentType, {}, function (res) {
        app.bindData($('#deptypeSel'), res.departmentTypes || [], 'dtid', 'name', true);
        form.render('select');
    }, null, false);
    app.post(api.system.queryCity, {}, function (res) {
        app.bindData($('#citySel'), res.citys || [], 'cid', 'name', true);
        form.render('select');
    }, null, false);

    form.on('select(cityFilter)', function (obj) {
        $('#cityProperSel').html('<option value="">请选择城区</option>');
        if (obj.value) {
            app.post(api.system.queryCityProperByCid, { 'cityProper.city.cid': obj.value }, function (res) {
                app.bindData($('#cityProperSel'), res.cityPropers || [], 'cpid', 'name', true);
                form.render('select');
            });
        } else form.render('select');
    });

    form.on('select(deptypeFilter)', function (obj) {
        if ($('#editForm [name="type"]').val() == 2 && obj.value) {
            var queryParams = { 'dept.type.dtid': obj.value };
            if ($('#companySel').val()) queryParams['company'] = $('#companySel').val();
            app.post(api.communion.queryDepartmentByDtid, queryParams, function (res) {
                app.bindData($('#deptSel'), res.deptList || res.departments || [], 'did', 'name', true);
                form.render('select');
            });
        }
    });

    // 类型切换：分组显示
    form.on('select(typeFilter)', function (obj) {
        var t = parseInt(obj.value, 10);
        var g = { company: 0, deptype: 0, dept: 0, city: 0, range: 0, chance: 0 };
        if (t === 0) { g.range = 1; }
        else if (t === 1) { /* 特殊：无附加字段 */ }
        else if (t === 3) { g.deptype = 1; g.range = 1; }
        else if (t === 2) { g.company = 1; g.deptype = 1; g.dept = 1; g.range = 1; }
        else if (t === 4) { g.city = 1; g.range = 1; }
        else if (t === 6) { g.range = 1; g.chance = 1; }
        $('.group-company').toggle(!!g.company);
        $('.group-deptype').toggle(!!g.deptype);
        $('.group-dept').toggle(!!g.dept);
        $('.group-city').toggle(!!g.city);
        $('.group-range').toggle(!!g.range);
        $('.group-chance').toggle(!!g.chance);
        $('#isDelete').prop('checked', [1, 2, 3, 4].indexOf(t) != -1);
        form.render('checkbox');
    });

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '名称', minWidth: 130 },
            { field: 'type', title: '类型', width: 100, templet: function (d) { return E.userRuleItemType[d.type] != null ? E.userRuleItemType[d.type] : ''; } },
            { field: 'departmentType', title: '部门类型', width: 110, templet: function (d) { return d.type == 3 && d.departmentType ? (d.departmentType.name || '') : ''; } },
            { field: 'department', title: '部门', width: 120, templet: function (d) { return d.type == 2 && d.department ? (d.department.name || '') : ''; } },
            { field: 'cityProper', title: '城区', width: 100, templet: function (d) { return d.type == 4 && d.cityProper ? (d.cityProper.name || '') : ''; } },
            { field: 'uppval', title: '起始值', width: 90, align: 'right', templet: function (d) { return d.uppval != null ? app.formatMoney(d.uppval) : ''; } },
            { field: 'lowval', title: '终止值', width: 90, align: 'right', templet: function (d) { return d.lowval != null ? app.formatMoney(d.lowval) : ''; } },
            { field: 'chance', title: '机会数', width: 80 },
            { field: 'priority', title: '优先级', width: 80 },
            { field: 'isSurplus', title: '减剩余数', width: 90, templet: function (d) { return E.userRuleItemIsSurplus[d.isSurplus] != null ? E.userRuleItemIsSurplus[d.isSurplus] : ''; } },
            { field: 'isDelete', title: '是否删除', width: 90, templet: function (d) { return E.userRuleItemIsDelete[d.isDelete] != null ? E.userRuleItemIsDelete[d.isDelete] : ''; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.userRuleItemStatus, d.status, function (k) { return parseInt(k, 10) === 0 ? 'layui-bg-green' : 'layui-bg-gray'; }); } },
            { field: 'handleTime', title: '操作时间', width: 165 },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.customer.deleteCustomerUserRuleItem, { 'customerUserRuleItem.curiid': obj.data.curiid }, function () {
                app.showAlert(app.success, '操作成功');
                query(state.page);
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
        app.post(api.customer.queryCustomerUserRuleItem, {
            'customerUserRuleItem.curid': curid,
            'paging.page': state.page,
            'paging.rows': state.rows
        }, function (res) {
            var list = res.customerUserRuleItems || [];
            table.reload('resultTable', { data: list });
            state.total = list.length;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render();
        // 默认面积类型
        $('#editForm [name="type"]').val('0');
        $('.group-company').hide(); $('.group-deptype').hide(); $('.group-dept').hide();
        $('.group-city').hide(); $('.group-chance').hide(); $('.group-range').show();
        state.editIndex = layer.open({ type: 1, title: '添加规则项目', content: $('#editBox'), area: ['600px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        // checkbox: checked → 0, unchecked → 1（与旧 getProp 映射一致）
        app.post(api.customer.addCustomerUserRuleItem, {
            'customerUserRuleItem.curid': curid,
            'customerUserRuleItem.departmentType.dtid': $('#editForm [name="deptype"]').val(),
            'customerUserRuleItem.department.did': $('#editForm [name="dept"]').val(),
            'customerUserRuleItem.name': $('#editForm [name="name"]').val(),
            'customerUserRuleItem.type': $('#editForm [name="type"]').val(),
            'customerUserRuleItem.uppval': $('#editForm [name="uppval"]').val(),
            'customerUserRuleItem.lowval': $('#editForm [name="lowval"]').val(),
            'customerUserRuleItem.chance': $('#editForm [name="chance"]').val(),
            'customerUserRuleItem.priority': $('#editForm [name="priority"]').val(),
            'customerUserRuleItem.status': $('#editForm [name="status"]').val(),
            'customerUserRuleItem.isSurplus': $('#isSurplus').prop('checked') ? 0 : 1,
            'customerUserRuleItem.isDelete': $('#isDelete').prop('checked') ? 0 : 1,
            'customerUserRuleItem.handleTime': $('#editForm [name="handleTime"]').val(),
            'customerUserRuleItem.cpid': $('#editForm [name="cityProper"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query(state.page);
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
