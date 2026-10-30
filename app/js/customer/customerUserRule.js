/** app/js/customer/customerUserRule.js —— 人员规则（旧 customerUserRule.js → layui）
 *  列表：pageCustomerUserRule（金额指标÷1000）；额外参数：当前用户（depage=dept/fatherDept 时按部门/分区过滤）。
 *  行操作：编辑 updateCustomerUserRule；项目（弹 customerUserRuleItem）；失效 disableCustomerUserRuleByCurid；
 *  开始接单/停止接单 updateCustomerUserRuleForStatus（状态随 depage 计算：null=5管理/dept=2部门/fatherDept|company=3分区）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var userInfo = customerCommon.ctx('userInfo');
    var depage = customerCommon.ctx('urlLoadParams').depage;
    var readonly = depage != null && depage !== '';
    var state = { page: 1, rows: 10, total: 0, editIndex: null, curid: null, searchUserId: null, editUserId: null };

    customerCommon.dateRange('#createTime');

    // —— 列定义（depage 只读页仅基础列） ——
    var baseCols = [
        { type: 'numbers', title: '#', width: 60 },
        { field: 'user', title: '人员', width: 110, templet: function (d) { return d.user ? (d.user.currentName || '') : ''; } },
        { field: 'user', title: '编号', width: 90, templet: function (d) { return d.user ? (d.user.userId != null ? d.user.userId : '') : ''; } },
        { field: 'user', title: '部门', width: 130, templet: function (d) { return d.user && d.user.dept ? (d.user.dept.name || '') : ''; } },
        { field: 'user', title: '分区', width: 130, templet: function (d) {
            return d.user && d.user.dept && d.user.dept.fatherDept ? (d.user.dept.fatherDept.name || '') : '';
        } },
        { field: 'status', title: '状态', width: 110, templet: function (d) { return customerCommon.badge(E.userRuleStatus, d.status, function (k) {
            var kk = parseInt(k, 10);
            if (kk === 0) return 'layui-bg-green';
            if (kk === 4) return 'layui-bg-gray';
            return 'layui-bg-orange';
        }); } }
    ];
    var metricCols = [
        { field: 'measureNum', title: '量尺数', width: 90 },
        { field: 'contractNum', title: '签单数', width: 90 },
        { field: 'contractPrice', title: '签单额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.contractPrice); } },
        { field: 'materialPrice', title: '主材额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.materialPrice); } },
        { field: 'designPrice', title: '设计费', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.designPrice); } },
        { field: 'predisPrice', title: '折前额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.predisPrice); } },
        { field: 'score', title: '得分', width: 80 },
        { field: 'rank', title: '排名', width: 80 },
        { field: 'chance', title: '机会数', width: 90 },
        { field: 'surplus', title: '剩余数', width: 90 },
        { field: 'polling', title: '轮询数', width: 90 },
        { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
        { field: 'createTime', title: '创建时间', width: 165 },
        { field: 'updateTime', title: '更新时间', width: 165 },
        { field: 'finishTime', title: '结束时间', width: 165 }
    ];
    var cols = readonly ? baseCols : baseCols.slice(0, 5).concat(metricCols, [baseCols[5], { title: '操作', width: 250, fixed: 'right', toolbar: '#rowToolbar' }]);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true, cols: [cols] });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') {
            state.curid = v.curid;
            state.editUserId = v.user ? v.user.userId : null;
            $('#userName').val(v.user ? v.user.currentName : '').attr('readonly', 'readonly');
            ['period', 'measureNum', 'contractNum', 'contractPrice', 'materialPrice', 'designPrice', 'predisPrice', 'chance', 'surplus'].forEach(function (k) {
                $('#editForm [name="' + k + '"]').val(v[k] != null ? v[k] : '');
            });
            app.clearValidator();
            state.editIndex = layer.open({ type: 1, title: '编辑人员规则', content: $('#editBox'), area: ['640px', 'auto'] });
        } else if (obj.event === 'item') {
            app.params.customer = $.extend({}, app.params.customer, { curid: v.curid });
            app.popup(api.index.customerUserRuleItemIndex.url, '人员规则项目');
        } else if (obj.event === 'disable') {
            app.showConfirm('确认将该人员规则置为失效?', function () {
                app.post(api.customer.disableCustomerUserRuleByCurid, { 'customerUserRule.curid': v.curid }, function () {
                    app.showAlert(app.success, '失效成功');
                    query(state.page);
                });
            });
        } else if (obj.event === 'start' || obj.event === 'stop') {
            if (v.status == 4) { app.showAlert(app.warning, '状态不可操作.'); return; }
            var status;
            if (depage == 'fatherDept' || depage == 'company') status = 3;   // 停止(分区)
            else if (depage == 'dept') status = 2;                            // 停止(部门)
            else status = 5;                                                  // 停止(管理)
            // 开始接单：启用；停止接单：按 depage 的停止状态
            var target = obj.event === 'start' ? 0 : status;
            app.post(api.customer.updateCustomerUserRuleForStatus, {
                'customerUserRule.curid': v.curid,
                'customerUserRule.status': target
            }, function () {
                app.showAlert(app.success, '操作成功');
                query(state.page);
            });
        }
    });

    if (!$('#rowToolbar').length) {
        // 开始接单（停止态 1/2/3/5）；停止接单（启用 0）
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '{{# if(d.status != 4){ }}'
            + '{{# if([1,2,3,5].indexOf(parseInt(d.status)) != -1){ }}<button class="layui-btn layui-btn-xs" lay-event="start">开始接单</button>{{# } }}'
            + '{{# if(d.status == 0){ }}<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="stop">停止接单</button>{{# } }}'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">编辑</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="item">项目</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="disable">失效</button>'
            + '{{# } }}'
            + '<\/script>'
        );
    }
    if (readonly) { $('#btnAdd').hide(); $('#btnDisableAll').hide(); }

    function query(pg) {
        state.page = pg || 1;
        var params = $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        });
        if (state.searchUserId) params['customerUserRule.user.userId'] = state.searchUserId;
        // 按当前用户过滤（depage 决定部门/分区维度）
        var user = userInfo && userInfo.user ? userInfo.user : null;
        if (user) {
            params['customerUserRule.user.userId'] = user.userId;
            if (depage == 'dept' && user.dept) {
                params['customerUserRule.user.dept.no'] = user.dept.no;
            } else if (depage == 'fatherDept' && user.dept && user.dept.fatherDept) {
                params['customerUserRule.user.dept.fatherDept.no'] = user.dept.fatherDept.no;
            }
        }
        app.post(api.customer.pageCustomerUserRule, params, function (res) {
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

    // —— 搜索人员 ——
    $('#btnPickUser').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.searchUserId = u.userId;
            $('#userInput').val(u.currentName);
        });
    });

    // —— 添加/编辑 ——
    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        $('#userName').removeAttr('readonly');
        state.curid = null;
        state.editUserId = null;
        state.editIndex = layer.open({ type: 1, title: '添加人员规则', content: $('#editBox'), area: ['640px', 'auto'] });
    });
    $('#btnEditPickUser').on('click', function () {
        if (state.curid != null) return; // 编辑时人员不可改
        customerCommon.userPicker(function (u) {
            state.editUserId = u.userId;
            $('#userName').val(u.currentName);
        });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        if (!state.editUserId) { app.showAlert(app.warning, '请选择人员'); return; }
        var isEdit = state.curid != null;
        var options = {
            'customerUserRule.user.userId': state.editUserId,
            'customerUserRule.period': $('#editForm [name="period"]').val(),
            'customerUserRule.measureNum': $('#editForm [name="measureNum"]').val(),
            'customerUserRule.contractNum': $('#editForm [name="contractNum"]').val(),
            'customerUserRule.contractPrice': $('#editForm [name="contractPrice"]').val(),
            'customerUserRule.materialPrice': $('#editForm [name="materialPrice"]').val(),
            'customerUserRule.designPrice': $('#editForm [name="designPrice"]').val(),
            'customerUserRule.predisPrice': $('#editForm [name="predisPrice"]').val(),
            'customerUserRule.chance': $('#editForm [name="chance"]').val(),
            'customerUserRule.surplus': $('#editForm [name="surplus"]').val()
        };
        if (isEdit) {
            options['customerUserRule.curid'] = state.curid;
            app.post(api.customer.updateCustomerUserRule, options, function () {
                app.showAlert(app.success, '操作成功');
                layer.close(state.editIndex);
                query(state.page);
            });
        } else {
            app.post(api.customer.addCustomerUserRule, options, function () {
                app.showAlert(app.success, '操作成功');
                layer.close(state.editIndex);
                query(state.page);
            });
        }
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    // —— 全部失效 ——
    $('#btnDisableAll').on('click', function () {
        app.showConfirm('确认将当前所有人员规则置为失效?', function () {
            app.post(api.customer.disableCustomerUserRule, {}, function () {
                app.showAlert(app.success, '已完成.');
                query(state.page);
            });
        });
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () {
        $('#searchForm')[0].reset();
        state.searchUserId = null;
        form.render('select');
        query(1);
    });
});
}); // end app.ready
