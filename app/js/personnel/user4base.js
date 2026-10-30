/** user4base.js —— 员工基础管理（pageUser + 添加/简化添加/导入 + 查看/编辑/工作经历） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'upload', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, upload = layui.upload, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, simpleIndex: null, viewIndex: null, expIndex: null, loginFlag: true };

    var statusMap = { 0: '在职', 1: '离职', 2: '休假', 3: '其他' };
    function stStatus(d) { var cls = { 0: 'layui-bg-green', 1: 'layui-bg-gray', 2: 'layui-bg-orange', 3: 'layui-bg-blue' }; return '<span class="layui-badge ' + (cls[d.status] || '') + '">' + (statusMap[d.status] || '---') + '<\/span>'; }

    app.post(api.communion.queryDepartmentType, {}, function (res) {
        app.bindData($('#simpleForm [name="dtid"]'), res.departmentTypes, 'dtid', 'name', true, function () { form.render('select'); triggerDept(); });
    }, null, false);
    app.bindData($('#simpleForm [name="status"]'), [{ key: 0, value: '在职' }, { key: 1, value: '离职' }, { key: 2, value: '休假' }, { key: 3, value: '其他' }], 'key', 'value', false, function () { form.render('select'); });
    laydate.render({ elem: '#birthday' });

    function triggerDept() {
        var dtid = $('#simpleForm [name="dtid"]').val(); if (!dtid) return;
        app.post(api.system.queryDutyByDtid, { 'duty.departmentType.dtid': dtid }, function (res) { app.bindData($('#simpleForm [name="duty.did"]'), res.dutys, 'did', 'name', true, function () { form.render('select'); }); });
        app.post(api.communion.queryDepartmentByDtid, { 'dept.type.dtid': dtid }, function (res) { app.bindData($('#simpleForm [name="dept.did"]'), res.deptList, 'did', 'name', true, function () { form.render('select'); }); });
    }
    $('#simpleForm [name="dtid"]').on('change', triggerDept);

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'userId', title: '员工编号', width: 100 },
                { field: 'loginId', title: '用户名', width: 120 },
                { field: 'dept', title: '部门', width: 140, templet: function (d) { return d.dept ? d.dept.name : '---'; } },
                { field: 'duty', title: '职位', width: 120, templet: function (d) { return d.duty ? d.duty.name : '---'; } },
                { field: 'role', title: '角色', width: 120, templet: function (d) { return d.role ? d.role.name : '---'; } },
                { field: 'phone', title: '联系方式', width: 140 },
                { field: 'status', title: '状态', width: 90, templet: stStatus },
                { title: '操作', width: 320, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, d = obj.data;
            if (ev === 'view') showView(d);
            else if (ev === 'edit') layer.open({ type: 2, title: '编辑', content: '../../views/personnel/user2edit.html?userId=' + d.userId, area: ['90%', '90%'], end: function () { query(state.page); } });
            else if (ev === 'exception') showExperience(d);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (v === '' || v == null) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.personel.pageUser, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    function showView(d) {
        app.post(api.personel.queryUserInfoByUserId, { 'userInfo.user.userId': d.userId }, function (res) {
            var u = res.userInfo || {}; var usr = u.user || {};
            var rows = [
                ['员工编号', usr.userId, '原工号', usr.oldUserId], ['用户名', usr.userName, '现用名', usr.currentName],
                ['性别', usr.gender, '部门', usr.dept ? usr.dept.name : ''], ['职位', usr.duty ? usr.duty.name : '', '角色', usr.role ? usr.role.name : ''],
                ['电话', usr.phone, '身份证', usr.identity], ['入职时间', u.entryTime, '薪资', u.salary]
            ];
            var html = '<table class="layui-table"><tbody>';
            for (var i = 0; i < rows.length; i++) { var w = rows[i]; html += '<tr><td><b>' + w[0] + '</b></td><td>' + (w[1] == null ? '无' : w[1]) + '</td><td><b>' + w[2] + '</b></td><td>' + (w[3] == null ? '无' : w[3]) + '</td></tr>'; }
            html += '</tbody></table>';
            $('#viewInfo').html(html);
            state.viewIndex = layer.open({ type: 1, title: '查看', content: $('#viewBox'), area: ['720px', '80%'] });
        });
    }

    function showExperience(d) {
        app.post(api.personel.queryUserExperienceByUid, { 'userExperience.uid': d.uid }, function (res) {
            state.expIndex = layer.open({ type: 1, title: '工作经历', content: $('#expBox'), area: ['640px', '80%'] });
            var html = '<ul class="layui-timeline">';
            $.each(res.userExperiences || [], function (i, v) {
                html += '<li class="layui-timeline-item"><div class="layui-timeline-content"><h3 class="layui-timeline-header">' + (v.type || '') + '</h3><p>备注：' + (v.comment || '无') + '</p><p>调动时间：' + (v.operateTime || '') + '</p></div></li>';
            });
            html += '</ul>';
            if (!res.userExperiences || !res.userExperiences.length) html = '<div style="padding:30px;text-align:center;color:#999;">无工作经历数据</div>';
            $('#expList').html(html);
        });
    }

    function openSimple() {
        app.clearValidator(); $('#simpleForm')[0].reset(); form.render('select'); triggerDept(); state.loginFlag = true;
        state.simpleIndex = layer.open({ type: 1, title: '添加员工', content: $('#simpleBox'), area: ['560px', '90%'], cancel: function () { app.clearValidator(); } });
    }
    function doSimpleSave() {
        if (app.validate('simpleForm') || !state.loginFlag) return;
        var now = new Date();
        var opt = {
            'userInfo.user.userName': $.trim($('#simpleForm [name="userName"]').val()),
            'userInfo.user.currentName': $('#simpleForm [name="currentName"]').val(),
            'userInfo.user.gender': $('#simpleForm [name="gender"]').val(),
            'userInfo.user.birthday': $('#simpleForm [name="birthday"]').val(),
            'userInfo.user.identity': $('#simpleForm [name="identity"]').val(),
            'userInfo.user.phone': $('#simpleForm [name="phone"]').val(),
            'userInfo.user.loginId': $('#simpleForm [name="loginId"]').val(),
            'userInfo.user.dtid': $('#simpleForm [name="dtid"]').val(),
            'userInfo.user.dept.did': $('#simpleForm [name="dept.did"]').val(),
            'userInfo.user.duty.did': $('#simpleForm [name="duty.did"]').val(),
            'userInfo.user.status': $('#simpleForm [name="status"]').val(),
            'userInfo.employWay': '', 'userInfo.entryTime': now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            'userInfo.political': '', 'userInfo.isMarried': '', 'userInfo.isBirth': '', 'userInfo.isHouseLoan': '',
            'userInfo.isCarLoan': '', 'userInfo.householdType': '', 'userInfo.hometownAddress': '', 'userInfo.address': '',
            'userInfo.isContract': '', 'userInfo.isInsurance': '', 'userInfo.bank': '', 'userInfo.bankCardNum': ''
        };
        app.post(api.personel.addUser, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.simpleIndex); state.simpleIndex = null; query(state.page); });
    }

    $('#simpleForm [name="loginId"]').on('blur', function () {
        var v = $.trim($(this).val());
        if (!v) { state.loginFlag = false; app.showTip($(this), '用户名不能为空', 2); return; }
        app.post(api.personel.queryUserByLoginId, { 'user.loginId': v }, function () { state.loginFlag = false; app.showTip($('#simpleForm [name="loginId"]'), '用户名已存在', 2); }, function () { state.loginFlag = true; });
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { layer.open({ type: 2, title: '添加员工', content: '../../views/personnel/user2edit.html', area: ['90%', '90%'], end: function () { query(state.page); } }); });
    $('#btnAddSimple').on('click', openSimple);
    $('#btnImport').on('click', function () {
        layer.open({
            type: 1, title: '上传员工', content: '<div style="padding:20px;"><input type="file" id="importFile" accept=".xls,.xlsx"><div class="layui-form-item" style="margin-top:12px;"><button type="button" class="layui-btn" id="btnDoImport">上传</button></div></div>',
            area: ['420px', 'auto'], success: function () {
                $('#btnDoImport').on('click', function () {
                    var f = $('#importFile')[0].files[0]; if (!f) { app.showAlert(app.warning, '请选择文件'); return; }
                    var fd = new FormData(); fd.append('uploadType', 4); fd.append('file', f);
                    $.ajax({ url: app.config.server + 'salary/importUserSalary.do', data: fd, type: 'POST', dataType: 'json', contentType: false, processData: false, success: function (res) { app.showAlert(app.success, '上传成功'); layer.closeAll(); }, error: function () { app.showAlert(app.error, '上传失败'); } });
                });
            }
        });
    });
    $('#btnSimpleSave').on('click', doSimpleSave);
    $('#btnSimpleCancel').on('click', function () { layer.close(state.simpleIndex); state.simpleIndex = null; });
});
}); // end app.ready
