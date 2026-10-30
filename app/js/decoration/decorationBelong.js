/** app/js/decoration/decorationBelong.js —— 装修单归属变更（弹窗子页）
 *  上下文：app.params.decoration = { orderId, orderBelongType: 0设计|1业务 }。
 *  流程：加载现有归属（queryDecorationBelong）→ 增删改行（本地暂存）→ 校验比例和=1 且仅一个默认 → 提交审批
 *  （api.approval.submitApprovalForDecorationBelong，审批人来自 queryApproverByType type=3）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var ctx = app.params.decoration || {};
    var orderId = ctx.orderId, belongType = ctx.orderBelongType == null ? 0 : ctx.orderBelongType;
    var rows = [];        // 当前归属行（belonger/department{did,name}/region{did,name}/rate/defaultFlag）
    var original = '';    // 原归属描述（审批表单用）
    var E = decorationCommon.ENUM;

    $('#orderIdLabel').text(orderId || '-');
    $('#belongTypeLabel').text(belongType == 0 ? '设计归属' : '业务归属');

    table.render({ elem: '#belongTable', id: 'belongTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'uid', title: '员工编号', width: 120, templet: function (d) { return d.belonger.userId; } },
            { field: 'name', title: '姓名', width: 110, templet: function (d) { return d.belonger.currentName; } },
            { field: 'dept', title: '所属部门', width: 140, templet: function (d) { return (d.department && d.department.name) || ''; } },
            { field: 'region', title: '所属大区', width: 140, templet: function (d) { return (d.region && d.region.name) || ''; } },
            { field: 'rate', title: '分配比例', width: 110 },
            { field: 'defaultFlag', title: '默认', width: 90, templet: function (d) { return d.defaultFlag == 1 ? '<span class="layui-badge layui-bg-green">是<\/span>' : '<span class="layui-badge layui-bg-gray">否<\/span>'; } },
            { title: '操作', width: 160, toolbar: '#rowToolbar' } ]],
        text: { none: '暂无归属数据' } });

    table.on('tool(belongTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'edit') editRow(v);
        else if (ev === 'del') {
            rows = rows.filter(function (r) { return r.belonger.userId != v.belonger.userId; });
            table.reload('belongTable', { data: rows });
        }
    });

    loadUsers(); loadBelongs();

    function loadBelongs() {
        app.post(api.decoration.queryDecorationBelong, { 'decorationBelong.orderId': orderId, 'decorationBelong.type': belongType, 'decorationBelong.status': 0 }, function (res) {
            rows = res.decorationBelongs || [];
            original = '';
            $.each(rows, function (i, v) {
                original += '编号:' + v.belonger.userId + ', 姓名: ' + v.belonger.currentName + ', 部门: ' + (v.department ? v.department.name : '') + ', 分区:' + (v.region ? v.region.name : '') + ', 比例:' + v.rate + '\n';
            });
            table.reload('belongTable', { data: rows });
        });
    }

    // 归属人下拉（按拼音找员工 → 全量启用户下拉）
    function loadUsers() {
        app.post(api.personel.queryUserByPinyin, { 'user.status': 0, 'departmentType.name': '' }, function (res) {
            var list = res.autoFillKeyValue || [];
            var html = '<option value="">请选择员工</option>';
            $.each(list, function (i, v) { html += '<option value="' + v.key + '">' + v.value + '<\/option>'; });
            $('#userId').html(html);
            form.render('select');
        });
    }
    // 选人后带出部门/大区
    form.on('select(userId)', function (d) {
        if (!d.value) { $('#deptName').val(''); $('#regionName').val(''); return; }
        app.post(api.personel.queryUserByUserId, { 'user.userId': d.value }, function (res) {
            var u = res.user || {}, dept = u.dept || {};
            $('#deptName').val(dept.name || '');
            $('#regionName').val(dept.fatherDept ? dept.fatherDept.name : '');
        });
    });

    var addIndex = null;
    $('#btnAddUser').on('click', function () {
        $('#addUserForm')[0].reset();
        $('#deptName').val(''); $('#regionName').val('');
        form.render();
        addIndex = layer.open({ type: 1, title: '添加归属人', content: $('#addUserBox'), area: ['560px', 'auto'],
            btn: ['确定', '取消'], yes: function (idx) {
                var uid = $('#userId').val();
                if (!uid) { app.showAlert(app.warning, '请选择归属人'); return; }
                var rate = parseFloat($('#belongRate').val());
                if (isNaN(rate) || rate < 0 || rate > 1) { app.showAlert(app.warning, '分配比例输入错误, 为0到1之间的小数'); return; }
                var dup = rows.filter(function (r) { return r.belonger.userId == uid; });
                if (dup.length) { app.showAlert(app.warning, '员工编号(' + uid + ')已存在不能重复添加'); return; }
                app.post(api.personel.queryUserByUserId, { 'user.userId': uid }, function (res) {
                    var u = res.user || {}, dept = u.dept || {};
                    rows.push({
                        belonger: { userId: uid, currentName: u.currentName || '' },
                        department: { did: dept.did, name: dept.name || '' },
                        region: { did: dept.fatherDept ? dept.fatherDept.did : '', name: dept.fatherDept ? dept.fatherDept.name : '' },
                        rate: rate, defaultFlag: $('#defaultFlag').prop('checked') ? 1 : 0
                    });
                    table.reload('belongTable', { data: rows });
                    layer.close(idx); addIndex = null;
                });
            } });
    });

    function editRow(v) {
        // 修改弹窗：分配比例 + 默认归属开关（对齐旧 updateModal）
        var html = '<div class="layui-form" style="padding:20px 30px;">'
            + '<div class="layui-form-item"><label class="layui-form-label">分配比例</label><div class="layui-input-inline"><input class="layui-input" id="updRate" value="' + v.rate + '"><\/div><div class="layui-form-mid layui-word-aux">0-1 之间的小数<\/div><\/div>'
            + '<div class="layui-form-item"><label class="layui-form-label">默认归属</label><div class="layui-input-inline"><input type="checkbox" id="updDefault" lay-skin="switch" lay-text="是|否"' + (v.defaultFlag == 1 ? ' checked' : '') + '><\/div><\/div>'
            + '<\/div>';
        layer.open({ type: 1, title: '修改归属 - ' + v.belonger.currentName, content: html, area: ['460px', 'auto'],
            btn: ['保存', '取消'], success: function () { form.render(); }, yes: function (idx) {
                var rate = parseFloat($('#updRate').val());
                if (isNaN(rate) || rate < 0 || rate > 1) { app.showAlert(app.warning, '分配比例输入错误, 为0到1之间的小数'); return; }
                var def = $('#updDefault').prop('checked') ? 1 : 0;
                $.each(rows, function (i, r) {
                    if (r.belonger.userId == v.belonger.userId) { r.rate = rate; r.defaultFlag = def; }
                    else if (def == 1) { r.defaultFlag = 0; }
                });
                table.reload('belongTable', { data: rows });
                layer.close(idx);
            } });
    }

    // 审批人（type=3，对齐旧 approvalUtils.initqueryApprovalUser）
    function loadApprovers() {
        app.post(api.approval.queryApproverByType, { 'approver.type': 3 }, function (res) {
            var html = '<option value="">请选择审批人</option>';
            $.each(res.approvers || [], function (i, v) {
                html += '<option value="' + v.userBase.userId + '">' + v.userBase.currentName + (v.comment ? '（' + v.comment + '）' : '') + '<\/option>';
            });
            $('#approveMan').html(html);
            form.render('select');
        });
    }

    $('#btnApply').on('click', function () {
        $('#changeReason').val('');
        loadApprovers();
        layer.open({ type: 1, title: '提交归属审批', content: $('#approveBox'), area: ['560px', 'auto'],
            btn: ['提交', '取消'], yes: function (idx) {
                var receiverId = $('#approveMan').val();
                if (!receiverId) { app.showAlert(app.error, '请选择审批人!'); return; }
                var rate = 0, defaultCount = 0, opts = {}, current = '';
                $.each(rows, function (i, r) {
                    opts['approvalDecorationBelongItems[' + i + '].orderId'] = orderId;
                    opts['approvalDecorationBelongItems[' + i + '].userId'] = r.belonger.userId;
                    opts['approvalDecorationBelongItems[' + i + '].bdid'] = r.department ? r.department.did : '';
                    opts['approvalDecorationBelongItems[' + i + '].brid'] = r.region ? r.region.did : '';
                    opts['approvalDecorationBelongItems[' + i + '].rate'] = r.rate;
                    opts['approvalDecorationBelongItems[' + i + '].defaultFlag'] = r.defaultFlag;
                    current += '编号:' + r.belonger.userId + ', 姓名: ' + r.belonger.currentName + ', 部门: ' + (r.department ? r.department.name : '') + ', 分区:' + (r.region ? r.region.name : '') + ', 比例:' + r.rate + '\n';
                    if (r.defaultFlag == 1) defaultCount++;
                    rate += parseFloat(r.rate);
                });
                if (rate != 1) { app.showAlert(app.warning, '分配比例的和必须是1'); return; }
                if (defaultCount != 1) { app.showAlert(app.warning, '必须有一个是默认归属用户'); return; }
                var comment = $.trim($('#changeReason').val());
                opts['approvalDecorationBelong.orderId'] = orderId;
                opts['approvalDecorationBelong.belongType'] = belongType;
                opts['approval.receiver.userId'] = receiverId;
                opts['approval.comment'] = comment;
                opts['forms'] = JSON.stringify([
                    { name: '装修单', value: orderId },
                    { name: '原归属', value: original },
                    { name: '现归属', value: current },
                    { name: '备注', value: comment }
                ]);
                app.post(api.approval.submitApprovalForDecorationBelong, opts, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx);
                });
            } });
    });
});
}); // end app.ready
