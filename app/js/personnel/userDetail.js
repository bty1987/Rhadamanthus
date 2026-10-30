/** userDetail.js —— 人员详情（queryUserInfoByUserId + 合同/教育/工作/经历 子列表 + 各类修改弹窗）
 * 从 url ?userId=&uid= 取，isExpert 默认 true */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { userId: null, uid: null, editIndex: null, flag: true, contractId: null, eduId: null, opId: null, expId: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.userId = getUrlParam('userId');
    state.uid = getUrlParam('uid');

    var getProp = { '0': true, '1': false, 'true': 0, 'false': 1 };
    function nv(v, def) { return (v == null || v === '') ? (def || '无') : v; }
    function getBirthday(idCard) { if (!idCard) return ''; var b = idCard.substr(6, 8); return b.replace(/(.{4})(.{2})/, '$1-$2-'); }
    function calaAge(birth) { if (!birth) return ''; var d = new Date(birth.replace(/-/g, '/')); var n = new Date(); return n.getFullYear() - d.getFullYear() - ((n.getMonth() < d.getMonth() || (n.getMonth() == d.getMonth() && n.getDate() < d.getDate())) ? 1 : 0); }
    function getDateYearSub(t) { if (!t) return ''; var d = new Date(); var mon = d.getMonth() + 1, day = d.getDate(); var curr = d.getFullYear() + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day); return ((Date.parse(curr) - Date.parse(t)) / 86400000 / 365).toFixed(1); }
    function yn(v, t, f) { return v == 0 ? (t || '是') : (f || '否'); }

    var politicalMap = { 0: '群众', 1: '党员', 2: '团员', 3: '民主党派' };
    var educationMap = { 0: '博士', 1: '硕士', 2: '本科', 3: '大专', 4: '高中', 5: '其他' };
    var employWayMap = { 0: '网络', 1: '推荐', 2: '招聘会', 3: '其他' };
    var employTypeMap = { 0: '正式', 1: '试用' };
    var insuranceTypeMap = { 0: '社保', 1: '商保' };
    var householdMap = { 0: '城镇', 1: '农村' };
    var levelMap = { 0: '初级', 1: '中级', 2: '高级' };
    var statusMap = { 0: '在职', 1: '离职', 2: '休假', 3: '其他' };

    loadUserInfo();

    function loadUserInfo() {
        app.post(api.personel.queryUserInfoByUserId, { 'userInfo.user.userId': state.userId }, function (res) {
            var u = res.userInfo || {}; var usr = u.user || {};
            var rows = [
                ['员工编号', nv(usr.userId), '原工号', nv(usr.oldUserId)],
                ['用户名', nv(usr.userName), '现用名', nv(usr.currentName)],
                ['性别', nv(usr.gender == 1 ? '男' : '女'), '年龄', nv(calaAge(getBirthday(usr.identity)))],
                ['出生日期', nv(getBirthday(usr.identity)), '身高', nv(u.height)],
                ['体重', nv(u.weight), '民族', nv(u.nation)],
                ['QQ', nv(u.qq), '微信', nv(u.wechat)],
                ['邮箱', nv(u.email), '政治面貌', nv(politicalMap[u.political])],
                ['身份证', nv(usr.identity), '电话', nv(usr.phone)],
                ['部门', nv(usr.dept ? usr.dept.name : ''), '职位', nv(usr.duty ? usr.duty.name : '')],
                ['角色', nv(usr.role ? usr.role.name : ''), '状态', nv(statusMap[usr.status])],
                ['登录名', nv(usr.loginId), '公司', nv(usr.companys)],
                ['职级', nv(u.rank), '产值类型', nv(u.form == 0 ? '产值' : '非产值')],
                ['是否已婚', yn(u.isMarried, '已婚', '未婚'), '是否已育', yn(u.isBirth, '已育', '未育')],
                ['是否有房贷', yn(u.isHouseLoan, '有', '无'), '是否有车贷', yn(u.isCarLoan, '有', '无')],
                ['驾照', yn(u.isCarID, '有', '无'), '护照', yn(u.isPassID, '有', '无')],
                ['港澳通行证', yn(u.isHMID, '有', '无'), '台湾通行证', yn(u.isTWID, '有', '无')],
                ['应聘方式', nv(employWayMap[u.employWay]), '用工类型', nv(employTypeMap[u.employType])],
                ['入职时间', nv(u.entryTime), '工龄(年)', nv(getDateYearSub(u.entryTime))],
                ['学校', nv(u.school), '学历', nv(educationMap[u.education])],
                ['专业', nv(u.specialty), '推荐人', nv(u.fangliner ? u.fangliner.currentName : '')],
                ['基本薪资', nv(u.salary), '岗位薪资', nv(u.palary)],
                ['开户行', nv(u.bank), '银行卡号', nv(u.bankCardNum)],
                ['备注', nv(u.comment), '', '']
            ];
            var html = '<table class="layui-table"><tbody>';
            for (var i = 0; i < rows.length; i++) { var w = rows[i]; html += '<tr><td><b>' + w[0] + '</b></td><td>' + w[1] + '</td><td><b>' + w[2] + '</b></td><td>' + w[3] + '</td></tr>'; }
            html += '</tbody></table>';
            $('#basicInfo').html(html);
        });
        loadAbout();
    }

    function loadAbout() {
        app.post(api.personel.queryUserContract, { 'userContract.uid': state.uid }, function (res) { renderList('#contractList', res.userContracts, [{ t: '名称', f: 'name' }, { t: '签订时间', f: 'signTime' }, { t: '状态', f: function (v) { return yn(v.status, '有效', '失效'); } }, { t: '说明', f: 'comment' }]); });
        app.post(api.personel.queryUserEducation, { 'userEducation.uid': state.uid }, function (res) { renderList('#educationList', res.userEducations, [{ t: '机构', f: 'organ' }, { t: '证书', f: 'certificate' }, { t: '专业', f: 'specialty' }, { t: '时间', f: function (v) { return (v.beginTime || '') + ' - ' + (v.endTime || ''); } }]); });
        app.post(api.personel.queryUserOperation, { 'userOperation.uid': state.uid }, function (res) { renderList('#operationList', res.userOperations, [{ t: '公司', f: 'company' }, { t: '行业', f: 'trade' }, { t: '职位', f: 'duty' }, { t: '薪资', f: 'salary' }]); });
        app.post(api.personel.queryUserExperienceByUid, { 'userExperience.uid': state.uid }, function (res) { renderList('#experienceList', res.userExperiences, [{ t: '类型', f: 'type' }, { t: '备注', f: 'comment' }, { t: '调动时间', f: 'operateTime' }]); });
    }

    function renderList(sel, list, cols) {
        if (!list || !list.length) { $(sel).html('<div style="padding:20px;text-align:center;color:#999;">暂无数据</div>'); return; }
        var html = '<table class="layui-table"><thead><tr>';
        $.each(cols, function (i, c) { html += '<th>' + c.t + '</th>'; });
        html += '</tr></thead><tbody>';
        $.each(list, function (i, v) {
            html += '<tr>';
            $.each(cols, function (j, c) { html += '<td>' + (typeof c.f === 'function' ? c.f(v) : (v[c.f] == null ? '' : v[c.f])) + '</td>'; });
            html += '</tr>';
        });
        html += '</tbody></table>';
        $(sel).html(html);
    }

    $('#btnAddContract').on('click', function () {
        app.showAlert(app.info, '请在员工合同页管理合同明细');
    });
    $('#btnAddEducation').on('click', function () {
        layer.open({ type: 2, title: '教育信息', content: '../../views/personnel/userEducation.html?uid=' + state.uid, area: ['80%', '80%'], end: function () { loadAbout(); } });
    });
    $('#btnAddOperation').on('click', function () {
        layer.open({ type: 2, title: '工作信息', content: '../../views/personnel/userOperation.html?uid=' + state.uid, area: ['80%', '80%'], end: function () { loadAbout(); } });
    });
    $('#btnUpdateBasic').on('click', function () {
        layer.open({ type: 2, title: '编辑员工', content: '../../views/personnel/user2edit.html?userId=' + state.userId, area: ['90%', '90%'], end: function () { loadUserInfo(); } });
    });
});
}); // end app.ready
