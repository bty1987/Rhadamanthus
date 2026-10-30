/** recruitment4select.js —— 招聘详情（queryRecruitmentByRid 回填只读视图） */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    var rid = getUrlParam('rid');
    var employWayMap = { 0: '网络', 1: '推荐', 2: '招聘会', 3: '其他' };
    var householdMap = { 0: '城镇', 1: '农村' };
    var politicalMap = { 0: '群众', 1: '党员', 2: '团员' };
    var educationMap = { 0: '博士', 1: '硕士', 2: '本科', 3: '大专', 4: '高中', 5: '其他' };
    function nv(v, def) { return (v == null || v === '') ? (def || '无') : v; }
    function yn(v, t, f) { return v == 0 ? (t || '是') : (f || '否'); }
    function yh(v) { return v == 0 ? '有' : '无'; }

    if (!rid) return;
    app.post(api.personel.queryRecruitmentByRid, { 'recruitment.rid': rid }, function (res) {
        var r = res.recruitment || {};
        var rows = [
            ['姓名', nv(r.name), '身份证号', nv(r.identity)],
            ['民族', nv(r.nation), '身高', nv(r.height)],
            ['体重', nv(r.weight), '应聘方式', nv(employWayMap[r.employWay])],
            ['户口类型', nv(householdMap[r.householdType]), '政治面貌', nv(politicalMap[r.political])],
            ['学历', nv(educationMap[r.education]), '电话', nv(r.phone)],
            ['微信', nv(r.wechat), 'QQ', nv(r.qq)],
            ['地址', nv(r.address), '籍贯', nv(r.nativePlace)],
            ['户籍所在地', nv(r.hometownPlace), '专业', nv(r.specialty)],
            ['紧急联系人', nv(r.emergencyMan), '紧急电话', nv(r.emergencyPhone)],
            ['是否已婚', yn(r.isMarried, '已婚', '未婚'), '是否已育', yn(r.isBirth, '已育', '未育')],
            ['是否有房', yh(r.isHouse), '是否有车', yh(r.isCar)],
            ['是否有房贷', yh(r.isHouseLoan), '是否有车贷', yh(r.isCarLoan)],
            ['是否有驾照', yh(r.isCarID), '是否有护照', yh(r.isPassID)],
            ['港澳通行证', yh(r.isHMID), '台湾通行证', yh(r.isTWID)],
            ['是否签合同', yn(r.isContract), '是否有社保', yn(r.isSnsurance)],
            ['消防', yn(r.isFire), '商保', yn(r.isCnsurance)],
            ['竞业', yn(r.isCompete), '培训', yn(r.isTrain)],
            ['前科', yn(r.isCriminal), '疾病', yn(r.isDisease)]
        ];
        var html = '<table class="layui-table"><tbody>';
        for (var i = 0; i < rows.length; i++) { var w = rows[i]; html += '<tr><td style="width:110px;"><b>' + w[0] + '</b></td><td style="width:200px;">' + w[1] + '</td><td style="width:110px;"><b>' + w[2] + '</b></td><td style="width:200px;">' + w[3] + '</td></tr>'; }
        html += '</tbody></table>';
        $('#recruitmentInfo').html(html);
    });
});
}); // end app.ready
