/** app/js/quotation/quotationAssignRequest.js —— 预算分配请求
 *  模式：url ?mode=self（自助 pageQuotationAssignRequestByUserId）/ 默认（pageQuotationAssignRequest）。
 *  新建 createQuotationAssignRequest；自动分配 addQuotationAssignRequestForAuto + autoQuotationAssign；
 *  手动分配 manualQuotationAssign；替换 transferQuotationAssign / reassignQuotationAssign；交付 finishQuotationAssign；
 *  取消/删除 deleteQuotationAssignRequest；沟通（quotationAssignTalk 弹窗）；编辑 updateQuotationAssignRequest。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var isSelfMode = urlLoad.mode === 'self';
    var userLabel = isSelfMode ? '预算员' : '预算员';
    var state = { page: 1, rows: 10, total: 0 };
    var curRequest = null;

    $('#userLabel').text(userLabel);
    $('#manualUserLabel').text(userLabel);

    // 公司下拉
    app.post(api.system.queryCompany, {}, function (res) {
        app.bindData($('#companySel'), res.companys || [], 'cid', 'name', false);
        form.render('select');
    }, null, false);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单号', width: 110, fixed: 'left' },
            { field: 'company', title: '公司', width: 150, templet: function (d) { return d.company ? d.company.name : ''; } },
            { field: 'department', title: '部门', width: 130, templet: function (d) { return d.department ? d.department.name : '所有部门'; } },
            { field: 'decorationType', title: '装修类型', width: 90, templet: function (d) { return E.assignDecorationType[d.decorationType] != null ? E.assignDecorationType[d.decorationType] : ''; } },
            { field: 'priority', title: '优先级', width: 80, templet: function (d) { return E.assignRequestPriority[d.priority] != null ? E.assignRequestPriority[d.priority] : d.priority; } },
            { field: 'status', title: '状态', width: 85, templet: function (d) { return qc.badge(E.assignRequestStatus, d.status); } },
            { field: 'budgetUser', title: userLabel, width: 95, templet: function (d) { return d.budgetUser ? d.budgetUser.currentName : ''; } },
            { field: 'creater', title: '请求人', width: 95, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
            { field: 'createTime', title: '请求时间', width: 160 },
            { field: 'assignTime', title: '分配时间', width: 160 },
            { title: '操作', width: 480, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        var apiObj = isSelfMode ? api.quotation.pageQuotationAssignRequestByUserId : api.quotation.pageQuotationAssignRequest;
        app.post(apiObj, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    // —— 可用预算员 ——
    function loadBudgeters($sel, cb) {
        app.post(api.quotation.queryQuotationAssignUserRuleForAvaile, {}, function (res) {
            var list = res.quotationAssignUserRules || [];
            var html = '<option value="">请选择</option>';
            $.each(list, function (i, v) {
                var uname = v.user ? (v.user.currentName || v.user.userName) : ('#' + v.qaurid);
                html += '<option value="' + (v.user ? v.user.userId : v.qaurid) + '">' + uname + '<\/option>';
            });
            $sel.html(html);
            form.render('select');
            if (cb) cb();
        });
    }

    // —— 新建/编辑 ——
    function openEdit(v) {
        curRequest = v || null;
        $('#editBox form')[0].reset();
        if (v) {
            $('#orderId').val(v.orderId).prop('disabled', true);
            $('#companySel').val(v.company ? v.company.cid : '');
            $('#decorationType').val(v.decorationType != null ? v.decorationType : 0);
            $('#priority').val(v.priority != null ? v.priority : 5);
        } else {
            $('#orderId').prop('disabled', false);
        }
        form.render('select');
        layer.open({ type: 1, title: curRequest ? '编辑分配请求' : '新建分配请求', content: $('#editBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#orderId').val())) { app.showAlert(app.warning, '请填写装修单号'); return; }
                if (curRequest) {
                    app.post(api.quotation.updateQuotationAssignRequest, {
                        'quotationAssignRequest.qarid': curRequest.qarid,
                        'quotationAssignRequest.priority': $('#priority').val(),
                        'quotationAssignRequest.decorationType': $('#decorationType').val()
                    }, function () {
                        app.showAlert(app.success, '更新成功');
                        layer.close(idx); query(state.page);
                    });
                } else {
                    app.post(api.quotation.createQuotationAssignRequest, {
                        'quotationAssignRequest.orderId': $.trim($('#orderId').val()),
                        'quotationAssignRequest.company.cid': $('#companySel').val(),
                        'quotationAssignRequest.decorationType': $('#decorationType').val(),
                        'quotationAssignRequest.priority': $('#priority').val()
                    }, function () {
                        app.showAlert(app.success, '创建成功');
                        layer.close(idx); query(1);
                    });
                }
            } });
    }
    $('#btnCreate').on('click', function () { openEdit(null); });

    // —— 自动分配 ——
    function autoAssign(orderId) {
        app.showConfirm('确认自动分配该装修单吗？系统将自动查找可用' + userLabel + '进行分配。', function () {
            app.post(api.quotation.addQuotationAssignRequestForAuto, { 'quotationAssign.orderId': orderId }, function () {
                app.post(api.quotation.autoQuotationAssign, { 'quotationAssign.orderId': orderId }, function () {
                    app.showAlert(app.info, '分配成功！已自动分配给' + userLabel);
                    query(state.page);
                }, function (err) {
                    app.showAlert(app.warning, ((err && err.errorMsg) || '分配失败') + '，已加入待分配队列，' + userLabel + '释放后将自动分配');
                    query(state.page);
                });
            });
        });
    }
    $('#btnAutoAssign').on('click', function () {
        layer.prompt({ title: '输入装修单号进行自动分配', formType: 0 }, function (value, idx) {
            layer.close(idx);
            autoAssign($.trim(value));
        });
    });

    // —— 手动分配 ——
    function manualAssign(v, isReplace) {
        curRequest = v;
        var $sel = isReplace ? $('#replaceBudgeterSel') : $('#budgeterSel');
        loadBudgeters($sel, function () {
            layer.open({ type: 1, title: isReplace ? '替换预算员' : '手动分配', content: isReplace ? $('#replaceBox') : $('#manualBox'), area: ['480px', 'auto'],
                btn: ['确定', '取消'], yes: function (idx) {
                    var userId = $sel.val();
                    if (!userId) { app.showAlert(app.warning, '请选择' + userLabel); return; }
                    layer.close(idx);
                    if (isReplace) {
                        app.post(api.quotation.transferQuotationAssign, { 'quotationAssign.orderId': v.orderId, 'quotationAssign.quoter.userId': userId }, function () {
                            app.showAlert(app.success, '替换成功'); query(state.page);
                        });
                    } else {
                        app.post(api.quotation.manualQuotationAssign, { 'quotationAssign.orderId': v.orderId, 'quotationAssign.quoter.userId': userId }, function () {
                            app.showAlert(app.success, '分配成功'); query(state.page);
                        });
                    }
                } });
        });
    }
    $('#btnManualAssign').on('click', function () {
        layer.prompt({ title: '输入装修单号进行手动分配', formType: 0 }, function (value, idx) {
            layer.close(idx);
            manualAssign({ orderId: $.trim(value) }, false);
        });
    });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'manual') manualAssign(v, false);
        else if (obj.event === 'replace') manualAssign(v, true);
        else if (obj.event === 'finish') {
            app.showConfirm('确认交付该分配请求?', function () {
                app.post(api.quotation.finishQuotationAssign, { 'quotationAssign.orderId': v.orderId }, function () {
                    app.showAlert(app.success, '交付成功'); query(state.page);
                });
            });
        } else if (obj.event === 'talk') {
            app.params.quotationAssignTalk = { orderId: v.orderId };
            app.popup(api.index.quotationAssignTalkIndex.url, '分配沟通: ' + v.orderId, null, { area: ['60%', '70%'] });
        } else if (obj.event === 'cancel' || obj.event === 'del') {
            app.showConfirm(obj.event === 'cancel' ? '确认取消该分配请求?' : '确认删除该分配请求?', function () {
                app.post(api.quotation.deleteQuotationAssignRequest, { 'quotationAssignRequest.qarid': v.qarid }, function () {
                    app.showAlert(app.info, '操作成功'); query(state.page);
                });
            });
        }
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
