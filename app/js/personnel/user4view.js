/** user4view.js —— 员工详情（queryUserInfoByUserId 回填只读视图）
 * 父页 popup 打开，从 url ?userId= 取 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    var userId = getUrlParam('userId');

    function getBirthday(idCard) {
        if (!idCard) return '';
        var b = idCard.substr(6, 8);
        return b.replace(/(.{4})(.{2})/, '$1-$2-');
    }
    function calaAge(birth) {
        if (!birth) return '';
        var d = new Date(birth.replace(/-/g, '/'));
        var n = new Date();
        return n.getFullYear() - d.getFullYear() - ((n.getMonth() < d.getMonth() || (n.getMonth() == d.getMonth() && n.getDate() < d.getDate())) ? 1 : 0);
    }
    function getDateYearSub(entryTime) {
        if (!entryTime) return '';
        var d = new Date();
        var mon = d.getMonth() + 1, day = d.getDate();
        var curr = d.getFullYear() + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (day < 10 ? '0' + day : day);
        var days = (Date.parse(curr) - Date.parse(entryTime)) / 86400000;
        return (days / 365).toFixed(1);
    }
    function nv(v, def) { return (v == null || v === '') ? (def || '无') : v; }

    var politicalMap = { 0: '群众', 1: '党员', 2: '团员', 3: '民主党派' };
    var householdMap = { 0: '城镇', 1: '农村' };
    var educationMap = { 0: '博士', 1: '硕士', 2: '本科', 3: '大专', 4: '高中', 5: '其他' };
    var employWayMap = { 0: '网络', 1: '推荐', 2: '招聘会', 3: '其他' };
    var employTypeMap = { 0: '正式', 1: '试用' };
    var insuranceTypeMap = { 0: '社保', 1: '商保' };
    var levelMap = { 0: '初级', 1: '中级', 2: '高级' };
    var statusMap = { 0: '在职', 1: '离职', 2: '休假', 3: '其他' };

    if (!userId) return;
    app.post(api.personel.queryUserInfoByUserId, { 'userInfo.user.userId': userId }, function (res) {
        var u = res.userInfo || {}; var usr = u.user || {};
        var rows = [
            ['员工编号', nv(usr.userId), '原工号', nv(usr.oldUserId)],
            ['用户名', nv(usr.userName), '现用名', nv(usr.currentName)],
            ['性别', nv(usr.gender == 1 ? '男' : '女'), '年龄', nv(calaAge(getBirthday(usr.identity)))],
            ['出生日期', nv(getBirthday(usr.identity)), '身高', nv(u.height), 'cm'],
            ['体重', nv(u.weight), 'kg', '民族', nv(u.nation)],
            ['QQ', nv(u.qq), '微信', nv(u.wechat)],
            ['邮箱', nv(u.email), '爱好', nv(u.hobby)],
            ['政治面貌', nv(politicalMap[u.political]), '工龄', nv(u.jobYears)],
            ['身份证', nv(usr.identity), '电话', nv(usr.phone)],
            ['现住址', nv(u.address), '籍贯', nv(u.hometownAddress)],
            ['户口类型', nv(householdMap[u.householdType]), '户籍所在地', nv(u.hometownPlace)],
            ['紧急联系人', nv(u.emergencyMan), '紧急电话', nv(u.emergencyPhone)],
            ['部门', nv(usr.dept ? usr.dept.name : ''), '职位', nv(usr.duty ? usr.duty.name : '')],
            ['部门类型', nv(usr.duty && usr.duty.departmentType ? usr.duty.departmentType.name : ''), '角色', nv(usr.role ? usr.role.name : '')],
            ['登录用户名', nv(usr.loginId), '公司', nv(usr.companys)],
            ['职级', nv(u.rank), '产值类型', nv(u.form == 0 ? '产值' : '非产值')],
            ['是否已婚', nv(u.isMarried == 0 ? '已婚' : '未婚'), '是否已育', nv(u.isBirth == 0 ? '已育' : '未育')],
            ['是否有房贷', nv(u.isHouseLoan == 0 ? '有' : '无'), '是否有车贷', nv(u.isCarLoan == 0 ? '有' : '无')],
            ['是否有驾照', nv(u.isCarID == 0 ? '有' : '无'), '是否有护照', nv(u.isPassID == 0 ? '有' : '无')],
            ['港澳通行证', nv(u.isHMID == 0 ? '有' : '无'), '台湾通行证', nv(u.isTWID == 0 ? '有' : '无')],
            ['推荐人', nv(u.fangliner ? u.fangliner.currentName : ''), '配偶', nv(u.lover)],
            ['是否签约合同', nv(u.isContract == 0 ? '是' : '否'), '签订时间', nv(u.signTime)],
            ['合同生效', nv(u.eignTime), '合同失效', nv(u.fignTime)],
            ['签约次数', nv(u.signNum), '预签次数', nv(u.preformNum)],
            ['是否社保', nv(u.isInsurance == 0 ? '是' : '否'), '社保类型', nv(u.isInsurance == 0 ? insuranceTypeMap[u.insuranceType] : '无')],
            ['养老保险号', nv(u.pensionNum), '医疗保险号', nv(u.medicalNum)],
            ['工伤保险号', nv(u.publicNum), '社保时间', nv(u.insuranceTime)],
            ['应聘方式', nv(employWayMap[u.employWay]), '用工类型', nv(employTypeMap[u.employType])],
            ['推荐人', nv(u.recommendMan), '入职时间', nv(u.entryTime)],
            ['试用期', nv(u.employTime), '工龄(年)', nv(getDateYearSub(u.entryTime))],
            ['是否应届', nv(u.isPresentGraduate == 0 ? '是' : '否'), '毕业时间', nv(u.graduateTime)],
            ['学校', nv(u.school), '学历', nv(educationMap[u.education])],
            ['专业', nv(u.specialty), '状态', nv(statusMap[usr.status])],
            ['基本薪资', nv(u.salary), '岗位薪资', nv(u.palary)],
            ['开户行', nv(u.bank), '银行卡号', nv(u.bankCardNum)],
            ['备注', nv(u.comment), '', '']
        ];
        var html = '<table class="layui-table" style="margin:0;"><tbody>';
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            html += '<tr><td style="width:110px;"><b>' + (r[0] || '') + '</b></td><td style="width:180px;">' + r[1] + (r[2] && r[2].length <= 3 ? r[2] : '') + '</td>';
            if (r[2] && r[2].length > 3) {
                html += '<td style="width:110px;"><b>' + r[2] + '</b></td><td style="width:180px;">' + (r[3] || '') + '</td>';
            } else {
                html += '<td></td><td></td>';
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
        $('#viewInfo').html(html);
    });
});
}); // end app.ready
