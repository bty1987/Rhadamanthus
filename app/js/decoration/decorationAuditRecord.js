/** app/js/decoration/decorationAuditRecord.js —— 审核扣款记录
 *  上下文：app.params.decoration = { orderId, designerId, deptId, auditStatusType: 'admin'|'select' }。
 *  上表：审核信息（queryDecorationAuditRecordByOrderId；admin 可修改/生成扣款）；
 *  下表：人员扣款（queryDecorationAuditScaleByArid；admin 可确认扣款/删除；可新增）。
 *  生成扣款：按 perCharge.designer=9 比例（total*9/10）makeDecorationAuditScale。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var ctx = app.params.decoration || {};
    var isAdmin = ctx.auditStatusType == 'admin';
    var orderId = ctx.orderId;
    var aid = null, curArid = null, curScaleArid = null;
    var recIdx = null, scaleIdx = null, recMode = 'add';

    if (!orderId) { app.showAlert(app.warning, '缺少订单上下文'); }

    table.render({ elem: '#recordTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'comment', title: '说明', minWidth: 160 },
            { field: 'unitprice', title: '单价', width: 90, templet: function (d) { return app.formatMoney(d.unitprice); } },
            { field: 'num', title: '数量', width: 80 },
            { field: 'discount', title: '折扣', width: 70 },
            { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(app.utils.changeThrDecimal(app.utils.accMul(app.utils.accMul(d.unitprice, d.num), d.discount / 10))); } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge({ 0: '未处理', 1: '已处理' }, d.status, function (k) { return k == 1 ? 'layui-bg-green' : 'layui-bg-gray'; }); } },
            { title: '操作', width: 260, toolbar: '#recordToolbar' } ]] });

    table.render({ elem: '#scaleTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'user', title: '扣款人', width: 110, templet: function (d) { return (d.belongUser && d.belongUser.currentName) || ''; } },
            { field: 'money', title: '扣款金额', width: 110, templet: function (d) { return app.formatMoney(d.money); } },
            { field: 'type', title: '职位', width: 110, templet: function (d) { return d.type == 0 ? '设计师' : '设计部经理'; } },
            { field: 'status', title: '扣款状态', width: 110, templet: function (d) { return decorationCommon.badge(E.auditScaleStatus, d.status); } },
            { title: '操作', width: 200, toolbar: '#scaleToolbar' } ]] });

    table.on('tool(recordTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'change') openRecord(v, 'change');
        else if (ev === 'make') makeScale(v);
        else if (ev === 'scale') loadScales(v.arid);
    });
    table.on('tool(scaleTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'confirm') confirmScale(v);
        else if (ev === 'del') delScale(v);
    });

    // —— 审核信息 ——
    function loadRecords() {
        app.post(api.decoration.queryDecorationAuditRecordByOrderId, { 'auditRecord.audit.decoration.orderId': orderId }, function (res) {
            var list = res.auditRecords || [];
            if (list.length) aid = list[0].audit.aid;
            $.each(list, function (i, v) { v._admin = isAdmin; });
            table.reload('recordTable', { data: list });
        });
    }
    loadRecords();

    $('#btnAddRecord').on('click', function () {
        if (!isAdmin) { app.showAlert(app.warning, '仅管理模式可添加'); return; }
        openRecord(null, 'add');
    });

    function openRecord(v, mode) {
        recMode = mode; curArid = v ? v.arid : null;
        $('#recordForm')[0].reset();
        if (v) { $('#comment').val(v.comment); $('#untiPrice').val(v.unitprice); $('#num').val(v.num); $('#discount').val(v.discount); }
        recIdx = layer.open({ type: 1, title: mode == 'add' ? '添加审核信息' : '修改审核信息', content: $('#recordBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var discount = $.trim($('#discount').val());
                if (parseFloat(discount) == 1 || parseFloat(discount) >= 10) { app.showAlert(app.warning, '折扣只能输入1-10的数字'); return; }
                var opts = {
                    'auditRecord.comment': $.trim($('#comment').val()),
                    'auditRecord.unitprice': $.trim($('#untiPrice').val()),
                    'auditRecord.num': $.trim($('#num').val()),
                    'auditRecord.discount': discount
                };
                if (mode == 'add') {
                    opts['auditRecord.audit.aid'] = aid;
                    opts['auditRecord.audit.decoration.orderId'] = orderId;
                    app.post(api.decoration.addDecorationAuditRecord, opts, function () {
                        app.showAlert(app.success, '添加成功'); layer.close(idx); loadRecords();
                    });
                } else {
                    opts['auditRecord.arid'] = curArid;
                    opts['auditRecord.audit.aid'] = aid;
                    app.post(api.decoration.updateDecorationAuditRecord, opts, function () {
                        app.showAlert(app.success, '修改成功'); layer.close(idx); loadRecords(); loadScales(curArid);
                    });
                }
            } });
    }

    // 生成人员扣款（设计师 perCharge=9 → total*9/10）
    function makeScale(v) {
        var total = app.utils.changeThrDecimal(app.utils.accMul(app.utils.accMul(v.unitprice, v.num), v.discount / 10));
        var designerCharge = E.perCharge['designer'] || 9;
        app.post(api.decoration.makeDecorationAuditScale, {
            'auditScales[0].auditRecord.arid': v.arid,
            'auditScales[0].belongUser.uid': ctx.designerId,
            'auditScales[0].belongDepartment.deptId': ctx.deptId,
            'auditScales[0].money': app.utils.accMul(total, designerCharge) / 10,
            'auditScales[0].type': 0
        }, function () {
            app.showAlert(app.success, '生成人员成功');
            loadRecords(); loadScales(v.arid);
        });
    }

    // —— 人员扣款 ——
    function loadScales(arid) {
        curScaleArid = arid;
        app.post(api.decoration.queryDecorationAuditScaleByArid, { 'auditScale.auditRecord.arid': arid }, function (res) {
            var list = res.auditScales || [];
            $.each(list, function (i, v) { v._admin = isAdmin; });
            table.reload('scaleTable', { data: list });
        });
    }

    // 扣款人下拉
    app.post(api.personel.queryUserByPinyin, { 'user.status': 0, 'departmentType.name': '' }, function (res) {
        var html = '<option value="">请选择员工</option>';
        $.each(res.autoFillKeyValue || [], function (i, v) { html += '<option value="' + v.key + '">' + v.value + '<\/option>'; });
        $('#scaleUser').html(html);
        form.render('select');
    });
    form.on('select(scaleUser)', function (d) {
        if (!d.value) { $('#scaleDept').val(''); return; }
        app.post(api.personel.queryUserByUserId, { 'user.userId': d.value }, function (res) {
            $('#scaleDept').val(res.user && res.user.dept ? res.user.dept.name : '');
        });
    });

    $('#btnAddScale').on('click', function () {
        if (!curScaleArid) { app.showAlert(app.warning, '请先在审核信息中选择一条查看人员扣款'); return; }
        $('#scaleForm')[0].reset(); $('#scaleDept').val('');
        scaleIdx = layer.open({ type: 1, title: '添加人员扣款', content: $('#scaleBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var uid = $('#scaleUser').val();
                var money = $.trim($('#scaleMoney').val());
                if (!uid) { app.showAlert(app.warning, '请选择扣款人'); return; }
                if (money === '' || isNaN(parseFloat(money))) { app.showAlert(app.warning, '请输入扣款金额'); return; }
                app.post(api.decoration.addDecorationAuditScale, {
                    'auditScale.auditRecord.arid': curScaleArid,
                    'auditScale.belongUser.uid': uid,
                    'auditScale.money': money,
                    'auditScale.type': 0
                }, function () {
                    app.showAlert(app.success, '添加成功'); layer.close(idx); loadScales(curScaleArid);
                });
            } });
    });

    function confirmScale(v) {
        app.showConfirm('确认提交扣款信息?', function () {
            app.post(api.decoration.updateDecorationAuditScaleForStatus, { 'auditScale.asid': v.asid, 'auditScale.status': 1 }, function () {
                app.showAlert(app.success, '操作成功'); loadScales(curScaleArid);
            });
        });
    }
    function delScale(v) {
        app.showConfirm('确认删除审核记录?', function () {
            app.post(api.decoration.deleteDecorationAuditScale, { 'auditScale.asid': v.asid }, function () {
                app.showAlert(app.success, '删除成功'); loadScales(curScaleArid);
            });
        });
    }

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationAuditIndex.url); });
});
}); // end app.ready
