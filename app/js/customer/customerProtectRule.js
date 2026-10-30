/** app/js/customer/customerProtectRule.js —— 保护期规则（旧 customerProtectRule.js → layui）
 *  列表：pageCustomerProtectRule（类型/起始值ge/终止值le/状态检索，金额÷1000）。
 *  添加：addCustomerCompanyRule→addCustomerProtectRule（×1000）；类型=4岗位时显示岗位下拉（queryDuty）。
 *  删除：deleteCustomerProtectRule。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    // 岗位下拉（旧代码引用 api.personel.queryDutyForOption，后端实际为 queryDuty.do）
    app.post(api.personel && api.personel.queryDutyForOption ? api.personel.queryDutyForOption : { url: 'queryDuty.do' }, {}, function (res) {
        app.bindData($('#dutySel'), res.duties || [], 'did', 'name', true);
        form.render('select');
    });

    // 类型切换：0面积/1预付/2设计/3定金 → 起止值；4岗位 → 岗位
    form.on('select(typeFilter)', function (obj) {
        var type = parseInt(obj.value, 10);
        if (type <= 3) {
            $('#uppvalDiv').show(); $('#lowvalDiv').show(); $('#dutyDiv').hide();
        } else {
            $('#uppvalDiv').hide(); $('#lowvalDiv').hide(); $('#dutyDiv').show();
        }
    });

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'title', title: '标题', minWidth: 140 },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return E.protectRuleType[d.type] != null ? E.protectRuleType[d.type] : ''; } },
            { field: 'uppval', title: '起始值', width: 100, align: 'right', templet: function (d) { return d.uppval != null ? app.formatMoney(d.uppval) : ''; } },
            { field: 'lowval', title: '终止值', width: 100, align: 'right', templet: function (d) { return d.lowval != null ? app.formatMoney(d.lowval) : ''; } },
            { field: 'duty', title: '岗位', width: 110, templet: function (d) { return d.duty ? (d.duty.name || '') : ''; } },
            { field: 'days', title: '天数', width: 90 },
            { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.protectRuleStatus, d.status); } },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.showConfirm('确认删除当前规则吗?', function () {
                app.post(api.customer.deleteCustomerProtectRule, { 'customerProtectRule.cprid': obj.data.cprid }, function () {
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
        app.post(api.customer.pageCustomerProtectRule, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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
        $('#uppvalDiv').show(); $('#lowvalDiv').show(); $('#dutyDiv').hide();
        state.editIndex = layer.open({ type: 1, title: '添加保护期规则', content: $('#editBox'), area: ['520px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        var options = {
            'customerProtectRule.title': $('#editForm [name="title"]').val(),
            'customerProtectRule.type': $('#editForm [name="type"]').val(),
            'customerProtectRule.uppval': $('#editForm [name="uppval"]').val(),
            'customerProtectRule.lowval': $('#editForm [name="lowval"]').val(),
            'customerProtectRule.duty.did': $('#editForm [name="duty"]').val(),
            'customerProtectRule.days': $('#editForm [name="days"]').val()
        };
        if ($('#editForm [name="uppval"]').val() === '') {
            options['customerProtectRule.uppval'] = $('#editForm [name="lowval"]').val();
        }
        app.post(api.customer.addCustomerProtectRule, options, function () {
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
