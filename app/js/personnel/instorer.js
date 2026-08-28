/** instorer.js —— 驻店人员管理（user.type=4，InstorerAction：pageInstorer/addInstorer/updateInstorer + 查看详情/重置密码） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, currentUid: null };
    var STATUS = { 0: '在职', 1: '离职', 2: '停薪留职' };

    loadInit();
    initTable(); query(1);

    function loadInit() {
        app.post(api.communion.queryDepartmentType, {}, function (res) {
            app.bindData($('#editForm [name="dtid"]'), res.departmentTypes, 'dtid', 'name', true, function () { form.render('select'); triggerDept(); });
        }, null, false);
        app.bindData($('#editForm [name="status"]'), [{key:0,value:'在职'},{key:1,value:'离职'},{key:2,value:'停薪留职'}], 'key', 'value', true, function () { form.render('select'); });
    }

    function triggerDept() {
        var dtid = $('#editForm [name="dtid"]').val(); if (!dtid) return;
        app.post(api.system.queryDutyByDtid, { 'duty.departmentType.dtid': dtid }, function (res) { app.bindData($('#editForm [name="duty.did"]'), res.dutys, 'did', 'name', true, function () { form.render('select'); }); });
        app.post(api.communion.queryDepartmentByDtid, { 'dept.type.dtid': dtid }, function (res) { app.bindData($('#editForm [name="dept.did"]'), res.deptList, 'did', 'name', true, function () { form.render('select'); }); });
    }
    $('#editForm [name="dtid"]').on('change', triggerDept);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'userId', title: '编号', width: 100 }, { field: 'loginId', title: '用户名', width: 120 }, { field: 'userName', title: '姓名', width: 100 },
                { field: 'dept', title: '部门', width: 140, templet: function (d) { return d.dept ? d.dept.name : '---'; } },
                { field: 'duty', title: '职位', width: 120, templet: function (d) { return d.duty ? d.duty.name : '---'; } },
                { field: 'phone', title: '联系方式', width: 140 },
                { field: 'oldUserId', title: '原工号', width: 100 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return STATUS[d.status] || d.status; } },
                { title: '操作', width: 320, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, d = obj.data;
            if (ev === 'view') showView(d);
            else if (ev === 'edit') openEdit(d);
            else if (ev === 'resetPassword') resetPassword(d);
            else if (ev === 'defaultPassword') defaultPassword(d);
        });
    }

    function showView(d) {
        app.post(api.personel.queryUserInfoByUserId, { 'userInfo.user.userId': d.userId }, function (res) {
            var u = res.userInfo || {}; var usr = u.user || {};
            var rows = [
                ['员工编号', usr.userId], ['原工号', usr.oldUserId], ['用户名', usr.userName], ['现用名', usr.currentName],
                ['性别', usr.gender], ['年龄', u.age], ['出生日期', u.birthday], ['部门', usr.dept ? usr.dept.name : ''],
                ['职位', usr.duty ? usr.duty.name : ''], ['身份证', usr.identity], ['电话', usr.phone],
                ['地址', u.address], ['籍贯', u.hometownAddress], ['紧急联系人', u.emergencyMan], ['紧急电话', u.emergencyPhone],
                ['学校', u.school], ['专业', u.specialty], ['薪资', u.salary], ['开户行', u.bank], ['银行卡号', u.bankCardNum]
            ];
            var html = '<table class="layui-table">';
            for (var i = 0; i < rows.length; i += 2) { html += '<tr><td><b>' + rows[i][0] + '</b></td><td>' + (rows[i][1] == null ? '无' : rows[i][1]) + '</td><td><b>' + (rows[i + 1] ? rows[i + 1][0] : '') + '</b></td><td>' + (rows[i + 1] ? (rows[i + 1][1] == null ? '无' : rows[i + 1][1]) : '') + '</td></tr>'; }
            html += '</table>';
            $('#viewInfo').html(html);
            layer.open({ type: 1, title: '驻店人员信息', content: $('#viewBox'), area: ['720px', '80%'] });
        });
    }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.currentUid = null;
        // 编辑仅后端 updateInstorer 支持姓名/手机号/原工号，其余字段只在添加时出现
        // 用内联 display:none 隐藏（.layui-hide 不会被 app.validate 跳过，空 loginId 会误报必填）
        $('#editBox .add-only').toggle(!d);
        if (d) {
            state.currentUid = d.uid;
            $('#editForm [name="userName"]').val(d.userName);
            $('#editForm [name="phone"]').val(d.phone);
            $('#editForm [name="oldUserId"]').val(d.oldUserId);
        }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑驻店人员' : '添加驻店人员', content: $('#editBox'), area: ['560px', '90%'], cancel: function () { app.clearValidator(); $('#editBox .add-only').show(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        // layui 渲染后的 select 处于 display:none，app.validate 会跳过，添加时手动校验必选
        if (!state.currentUid && (!$('#editForm [name="dept.did"]').val() || !$('#editForm [name="duty.did"]').val())) {
            return app.showAlert(app.warning, '请选择部门和职位');
        }
        var opt = {
            'instorer.oldUserId': $('#editForm [name="oldUserId"]').val(),
            'instorer.loginId': $('#editForm [name="loginId"]').val(),
            'instorer.userName': $.trim($('#editForm [name="userName"]').val()),
            'instorer.currentName': $.trim($('#editForm [name="userName"]').val()),
            'instorer.gender': 0,
            'instorer.identity': '',
            'instorer.phone': $('#editForm [name="phone"]').val(),
            'instorer.dept.did': $('#editForm [name="dept.did"]').val(),
            'instorer.duty.did': $('#editForm [name="duty.did"]').val(),
            'instorer.status': $('#editForm [name="status"]').val()
        };
        var apiDef = state.currentUid ? (opt['instorer.uid'] = state.currentUid, api.personel.updateInstorer) : api.personel.addInstorer;
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex); state.editIndex = null;
            $('#editBox .add-only').show();
            query(state.page);
        });
    }

    function resetPassword(d) { app.showConfirm('确定要重置(' + (d.userName || '') + ')的密码吗?', function () { app.post(api.personel.resetPassword, { 'user.userId': d.userId }); }); }
    function defaultPassword(d) { app.showConfirm('确定要重置(' + (d.userName || '') + ')密码为默认密码?', function () { app.post(api.personel.defaultPassword, { 'user.userId': d.userId }); }); }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (v === '' || v == null) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.personel.pageInstorer, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; $('#editBox .add-only').show(); });
});
}); // end app.ready
