/** user.js —— 员工管理（pageUser + 简化添加 + 跳转子页查看/编辑/合同等）
 * 旧 user.js 通过 pageType(expert/common) 切换列与按钮集合，这里保持兼容：默认 expert 模式 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, simpleIndex: null };

    loadDeptType();
    initTable(); query(1);

    function loadDeptType() {
        app.post(api.communion.queryDepartmentType, {}, function (res) {
            app.bindData($('#simpleForm [name="dtid"]'), res.departmentTypes, 'dtid', 'name', true, function () { form.render('select'); });
            triggerDeptChange();
        }, null, false);
        app.bindData($('#simpleForm [name="status"]'), [
            { key: 0, value: '在职' }, { key: 1, value: '离职' }, { key: 2, value: '休假' }, { key: 3, value: '其他' }
        ], 'key', 'value', false, function () { form.render('select'); });
    }

    function triggerDeptChange() {
        var dtid = $('#simpleForm [name="dtid"]').val();
        if (!dtid) return;
        app.post(api.system.queryDutyByDtid, { 'duty.departmentType.dtid': dtid }, function (res) {
            app.bindData($('#simpleForm [name="duty.did"]'), res.dutys, 'did', 'name', true, function () { form.render('select'); });
        });
        app.post(api.communion.queryDepartmentByDtid, { 'dept.type.dtid': dtid }, function (res) {
            app.bindData($('#simpleForm [name="dept.did"]'), res.deptList, 'did', 'name', true, function () { form.render('select'); });
        });
    }

    $('#simpleForm [name="dtid"]').on('change', triggerDeptChange);

    function stStatus(d) {
        var map = { 0: '在职', 1: '离职', 2: '休假', 3: '其他' };
        var cls = { 0: 'layui-bg-green', 1: 'layui-bg-gray', 2: 'layui-bg-orange', 3: 'layui-bg-blue' };
        return '<span class="layui-badge ' + (cls[d.status] || '') + '">' + (map[d.status] != null ? map[d.status] : '---') + '<\/span>';
    }
    function hideId(s) { return s ? String(s).replace(/(\d{6})\d{8}(\w{4})/, '$1********$2') : ''; }
    function hidePhone(p) { return p ? String(p).replace(/^(\d{3})\d+(\d{4})$/, '$1****$2') : ''; }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'userId', title: '员工编号', width: 100 },
                { field: 'userName', title: '用户名', width: 120 },
                { field: 'currentName', title: '现用名', width: 100 },
                { field: 'dept', title: '部门', width: 140, templet: function (d) { return d.dept ? d.dept.name : '---'; } },
                { field: 'duty', title: '职位', width: 120, templet: function (d) { return d.duty ? d.duty.name : '---'; } },
                { field: 'role', title: '角色', width: 120, templet: function (d) { return d.role ? d.role.name : '---'; } },
                { field: 'phone', title: '联系方式', width: 140, templet: function (d) { return hidePhone(d.phone); } },
                { field: 'identity', title: '身份证', width: 200, templet: function (d) { return hideId(d.identity); } },
                { field: 'status', title: '状态', width: 90, templet: stStatus },
                { title: '操作', width: 480, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, d = obj.data;
            if (ev === 'view') openPopup(d, '../../views/personnel/user4view.html?userId=' + d.userId, '查看');
            else if (ev === 'edit') openPopup(d, '../../views/personnel/user2edit.html?userId=' + d.userId + '&type=1', '编辑');
            else if (ev === 'detail') openPopup(d, '../../views/personnel/userDetail.html?userId=' + d.userId + '&uid=' + d.uid, '人员信息');
            else if (ev === 'contract') location.href = '../../views/personnel/userContract.html?userId=' + d.userId + '&uid=' + d.uid;
            else if (ev === 'education') openPopup(d, '../../views/personnel/userEducation.html?uid=' + d.uid, '教育信息');
            else if (ev === 'experience') openPopup(d, '../../views/personnel/userExperience.html?uid=' + d.uid, '工作经历');
            else if (ev === 'job') openPopup(d, '../../views/personnel/userOperation.html?uid=' + d.uid, '工作信息');
            else if (ev === 'partner') openPopup(d, '../../views/personnel/userPartner.html?uid=' + d.uid, '合作');
            else if (ev === 'right') openPopup(d, '../../views/personnel/user4advance.html', '权配');
            else if (ev === 'leave') doLeave(d);
            else if (ev === 'resetPassword') resetPwd(d);
            else if (ev === 'print') openPopup(d, '../../views/personnel/userPrint.html?userId=' + d.userId + '&uid=' + d.uid, '应聘登记表');
        });
    }

    function openPopup(d, url, title) { layer.open({ type: 2, title: title, content: url, area: ['90%', '90%'] }); }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (v === '' || v == null) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.personel.pageUser, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage(Math.min(pg.totalPage || 0, 59));
        });
    }
    function renderPage(tp) { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function doLeave(d) {
        app.showConfirm('确定要离职(' + (d.userName || '') + ')吗？', function () {
            app.post(api.personel.quitUser, { 'userId': d.userId, 'approve': 'agree' }, function () {
                app.showAlert(app.success, '离职成功'); query(state.page);
            });
        });
    }
    function resetPwd(d) {
        app.showConfirm('确定要重置(' + (d.userName || '') + ')的密码吗?', function () {
            app.post(api.personel.resetPassword, { 'user.userId': d.userId });
        });
    }

    function openSimple() {
        app.clearValidator(); $('#simpleForm')[0].reset(); form.render('select'); triggerDeptChange();
        state.simpleIndex = layer.open({ type: 1, title: '添加员工', content: $('#simpleBox'), area: ['560px', '90%'], cancel: function () { app.clearValidator(); } });
    }

    function doSimpleSave() {
        if (app.validate('simpleForm')) return;
        var loginId = $.trim($('#simpleForm [name="loginId"]').val());
        var valid = true;
        app.post(api.personel.queryUserByLoginId, { 'user.loginId': loginId }, function (res) {
            app.showTip($('#simpleForm [name="loginId"]'), '用户名已存在', 2); valid = false;
        }, function () { valid = true; }, false);
        if (!valid) return;

        var now = new Date();
        var opt = {
            'userInfo.user.userName': $.trim($('#simpleForm [name="userName"]').val()),
            'userInfo.user.currentName': $('#simpleForm [name="currentName"]').val(),
            'userInfo.user.gender': $('#simpleForm [name="gender"]').val(),
            'userInfo.user.identity': $('#simpleForm [name="identity"]').val(),
            'userInfo.user.phone': $('#simpleForm [name="phone"]').val(),
            'userInfo.user.loginId': $('#simpleForm [name="loginId"]').val(),
            'userInfo.user.dtid': $('#simpleForm [name="dtid"]').val(),
            'userInfo.user.dept.did': $('#simpleForm [name="dept.did"]').val(),
            'userInfo.user.duty.did': $('#simpleForm [name="duty.did"]').val(),
            'userInfo.user.status': $('#simpleForm [name="status"]').val(),
            'userInfo.salary': 0,
            'userInfo.fangliner.userId': '',
            'userInfo.entryTime': now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate(),
            'userInfo.hometownAddress': '', 'userInfo.address': '', 'userInfo.bank': '', 'userInfo.bankCardNum': '',
            'userInfo.isMarried': 1, 'userInfo.isBirth': 1, 'userInfo.isHouseLoan': 1, 'userInfo.isCarLoan': 1,
            'userInfo.isCarID': 1, 'userInfo.isPassID': 1, 'userInfo.isHMID': 1, 'userInfo.isTWID': 1,
            'userInfo.isPresentGraduate': 1, 'userInfo.isInsurance': 1
        };
        app.post(api.personel.addUser, opt, function () {
            app.showAlert(app.success, '操作成功'); layer.close(state.simpleIndex); state.simpleIndex = null; query(state.page);
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () {
        layer.open({ type: 2, title: '添加员工', content: '../../views/personnel/user2edit.html', area: ['90%', '90%'], end: function () { query(state.page); } });
    });
    $('#btnAddSimple').on('click', openSimple);
    $('#btnExport').on('click', function () {
        layer.open({ type: 2, title: '导出人员信息', content: '../../views/personnel/user2export.html', area: ['640px', '480px'] });
    });
    $('#btnSimpleSave').on('click', doSimpleSave);
    $('#btnSimpleCancel').on('click', function () { layer.close(state.simpleIndex); state.simpleIndex = null; });
});
}); // end app.ready
