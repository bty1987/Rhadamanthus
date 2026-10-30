/** app/js/quotation/quotationAssignUserRule.js —— 预算员规则
 *  列表：pageQuotationAssignUserRuleByCondition；新增/编辑 create/updateQuotationAssignUserRule（预算员/公司/支持类型）；
 *  启停 updateQuotationAssignUserRuleForStatus；删除 deleteQuotationAssignUserRule；
 *  项目（明细弹窗 quotationAssignUserRuleItem）；查看任务（该预算员的分配请求列表）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0 };
    var curRule = null;

    app.post(api.system.queryCompany, {}, function (res) {
        app.bindData($('#companySel'), res.companys || [], 'cid', 'name', false);
        form.render('select');
    }, null, false);
    app.post(api.personel.queryUserForOption, {}, function (res) {
        app.bindData($('#userSel'), res.users || [], 'userId', 'currentName', false);
        form.render('select');
    }, null, false);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'user', title: '预算员', width: 120, fixed: 'left', templet: function (d) { return d.user ? d.user.currentName : ''; } },
            { field: 'company', title: '公司', width: 150, templet: function (d) { return d.company ? d.company.name : ''; } },
            { field: 'supportedType', title: '支持类型', width: 95, templet: function (d) { return E.assignSupportedType[d.supportedType] != null ? E.assignSupportedType[d.supportedType] : d.supportedType; } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return qc.badge(E.assignUserRuleStatus, d.status); } },
            { field: 'currentTaskCount', title: '当前任务', width: 90 },
            { field: 'lastFinishTime', title: '最后完成时间', width: 160 },
            { field: 'createTime', title: '创建时间', width: 160 },
            { title: '操作', width: 380, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationAssignUserRuleByCondition, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(v) {
        curRule = v || null;
        $('#editBox form')[0].reset();
        if (v) {
            $('#userSel').val(v.user ? v.user.userId : '');
            $('#companySel').val(v.company ? v.company.cid : '');
            $('#supportedType').val(v.supportedType != null ? v.supportedType : -1);
        }
        form.render('select');
        layer.open({ type: 1, title: curRule ? '编辑规则' : '新增规则', content: $('#editBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$('#userSel').val() || !$('#companySel').val()) { app.showAlert(app.warning, '请选择预算员与公司'); return; }
                var options = {
                    'quotationAssignUserRule.company.cid': $('#companySel').val(),
                    'quotationAssignUserRule.supportedType': $('#supportedType').val()
                };
                if (curRule) {
                    options['quotationAssignUserRule.qaurid'] = curRule.qaurid;
                    app.post(api.quotation.updateQuotationAssignUserRule, options, function () {
                        app.showAlert(app.success, '更新成功');
                        layer.close(idx); query(state.page);
                    });
                } else {
                    options['quotationAssignUserRule.user.uid'] = $('#userSel').val();
                    app.post(api.quotation.addQuotationAssignUserRule, options, function () {
                        app.showAlert(app.success, '新增成功');
                        layer.close(idx); query(1);
                    });
                }
            } });
    }

    table.render({ elem: '#tasksTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单号', width: 120 },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return qc.badge(E.assignRequestStatus, d.status); } },
            { field: 'priority', title: '优先级', width: 80, templet: function (d) { return E.assignRequestPriority[d.priority] != null ? E.assignRequestPriority[d.priority] : d.priority; } },
            { field: 'createTime', title: '请求时间', width: 165 },
            { field: 'assignTime', title: '分配时间', width: 165 } ]] });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'item') {
            app.params.quotation = $.extend({}, app.params.quotation, { assignUserRule: v });
            app.popup(api.index.quotationAssignUserRuleItemIndex.url, '规则明细 - ' + (v.user ? v.user.currentName : v.qaurid), null, { area: ['85%', '85%'] });
        } else if (obj.event === 'tasks') {
            app.post(api.quotation.pageQuotationAssignRequest, { 'paging.page': 1, 'paging.rows': 100, 'filters[0].field': 'budgetUser.userId', 'filters[0].data': v.user ? v.user.userId : '', 'filters[0].op': 'eq' }, function (res) {
                table.reload('tasksTable', { data: (res.paging || {}).data || [] });
                layer.open({ type: 1, title: '任务列表 - ' + (v.user ? v.user.currentName : ''), content: $('#tasksBox'), area: ['760px', '70%'] });
            });
        } else if (obj.event === 'enable') {
            app.post(api.quotation.updateQuotationAssignUserRuleForStatus, { 'quotationAssignUserRule.qaurid': v.qaurid, 'quotationAssignUserRule.status': v.status == 1 ? 2 : 1 }, function () { query(state.page); });
        } else if (obj.event === 'del') {
            app.showConfirm('确认删除该规则?', function () {
                app.post(api.quotation.deleteQuotationAssignUserRule, { 'quotationAssignUserRule.qaurid': v.qaurid }, function () {
                    app.showAlert(app.info, '删除成功'); query(state.page);
                });
            });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
