/** userPrint.js —— 应聘登记表（queryUserInfoByUserId + queryUserEducation + queryUserOperation 渲染打印表格）
 * 从 url ?userId=&uid= 取。页面在弹窗内，window.print() 触发浏览器打印 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    var userId = getUrlParam('userId');
    var uid = getUrlParam('uid');

    function nv(v, def) { return (v == null || v === '') ? (def || '无') : v; }
    function getBirthday(idCard) { if (!idCard) return ''; var b = idCard.substr(6, 8); return b.replace(/(.{4})(.{2})/, '$1-$2-'); }
    function calaAge(birth) { if (!birth) return ''; var d = new Date(birth.replace(/-/g, '/')); var n = new Date(); return n.getFullYear() - d.getFullYear() - ((n.getMonth() < d.getMonth() || (n.getMonth() == d.getMonth() && n.getDate() < d.getDate())) ? 1 : 0); }

    var politicalMap = { 0: '群众', 1: '党员', 2: '团员', 3: '民主党派' };
    var householdMap = { 0: '城镇', 1: '农村' };
    var educationMap = { 0: '博士', 1: '硕士', 2: '本科', 3: '大专', 4: '高中', 5: '其他' };
    var employWayMap = { 0: '网络', 1: '推荐', 2: '招聘会', 3: '其他' };

    if (!userId) { $('#reslist').html('<div style="padding:30px;color:#999;">缺少 userId 参数</div>'); return; }

    var userInfo = {};
    app.post(api.personel.queryUserInfoByUserId, { 'userInfo.user.userId': userId }, function (res) {
        userInfo = res.userInfo || {};
        var u = userInfo.user || {};
        var html = '';
        html += '<h2 style="text-align:center;padding:16px 0;">方林装饰应聘登记表</h2>';
        html += '<table class="layui-table" style="border:1px solid #999;"><tbody>';
        html += '<tr><td colspan="12"><b>承诺书</b></td></tr>';
        html += '<tr><td colspan="12">1、我在本应聘申请表内所填写的各项内容均属事实，保证没有与事实不符的欺骗行为。如因上述行为所造成的一切法律责任和经济损失均由我本人承担。</td></tr>';
        html += '<tr><td colspan="12">2、承诺主动协助公司办理保险关系新建或转移等相关入职所需手续并提供所需材料。</td></tr>';
        html += '<tr><td colspan="9">3、我同意接受公司对我所填写的各项经历进行背景调查。</td><td colspan="3">承诺人签字：</td></tr>';
        html += '<tr><td colspan="2">姓名</td><td>' + nv(u.userName) + '</td><td>性别</td><td>' + nv(u.gender) + '</td><td colspan="2">出生日期</td><td>' + getBirthday(u.identity) + '</td><td>身高</td><td>' + nv(userInfo.height) + '</td><td colspan="2">照片</td></tr>';
        html += '<tr><td colspan="2">现用名</td><td>' + nv(u.currentName) + '</td><td>民族</td><td>' + nv(userInfo.nation) + '</td><td colspan="2">最高学历</td><td>' + nv(educationMap[userInfo.education]) + '</td><td>体重</td><td>' + nv(userInfo.weight) + '</td><td colspan="2"></td></tr>';
        html += '<tr><td colspan="2">微信号码</td><td colspan="3">' + nv(userInfo.wechat) + '</td><td colspan="2">QQ号码</td><td colspan="5">' + nv(userInfo.qq) + '</td></tr>';
        html += '<tr><td colspan="2">政治面貌</td><td>' + nv(politicalMap[userInfo.political]) + '</td><td>年龄</td><td>' + calaAge(getBirthday(u.identity)) + '</td><td colspan="2">户籍所在地</td><td colspan="5">' + nv(userInfo.hometownPlace) + '</td></tr>';
        html += '<tr><td colspan="2">专业</td><td>' + nv(userInfo.specialty) + '</td><td>婚否</td><td>' + (userInfo.isMarried == 0 ? '已婚' : '未婚') + '</td><td colspan="2">现住址</td><td colspan="5">' + nv(userInfo.address) + '</td></tr>';
        html += '<tr><td colspan="2">籍贯</td><td>' + nv(userInfo.hometownPlace) + '</td><td>育否</td><td>' + (userInfo.isBirth == 0 ? '已育' : '未育') + '</td><td colspan="2">身份证号</td><td colspan="5">' + nv(u.identity) + '</td></tr>';
        html += '<tr><td colspan="2">联系电话</td><td colspan="3">' + nv(u.phone) + '</td><td colspan="2">紧急联系人电话</td><td colspan="2">' + nv(userInfo.emergencyPhone) + '</td><td colspan="2">与本人关系</td><td></td></tr>';
        html += '<tr><td colspan="2">户口类型</td><td colspan="3">' + nv(householdMap[userInfo.householdType]) + '</td><td colspan="2">应聘方式</td><td colspan="5">' + nv(employWayMap[userInfo.employWay]) + '</td></tr>';
        html += '</tbody></table>';

        var eduRows = [];
        var opRows = [];
        var doneCount = 0;
        function maybeRender() {
            doneCount++;
            if (doneCount < 2) return;
            if (eduRows.length) {
                html += '<table class="layui-table"><thead><tr><th>起止时间</th><th>培训内容</th><th>学校名称</th><th>专业</th><th>取得证书</th></tr></thead><tbody>';
                $.each(eduRows, function (i, v) {
                    html += '<tr><td>' + (v.beginTime || '') + '-' + (v.endTime || '') + '</td><td>' + nv(v.content) + '</td><td>' + nv(v.organ) + '</td><td>' + nv(v.specialty) + '</td><td>' + nv(v.certificate) + '</td></tr>';
                });
                html += '</tbody></table>';
            }
            if (opRows.length) {
                html += '<table class="layui-table"><thead><tr><th>起止时间</th><th>单位名称</th><th>所属行业</th><th>职务</th><th>薪金</th><th>离职原因</th></tr></thead><tbody>';
                $.each(opRows, function (i, v) {
                    html += '<tr><td>' + (v.beginTime || '') + '-' + (v.endTime || '') + '</td><td>' + nv(v.company) + '</td><td>' + nv(v.trade) + '</td><td>' + nv(v.duty) + '</td><td>' + nv(v.salary) + '</td><td>' + nv(v.comment) + '</td></tr>';
                });
                html += '</tbody></table>';
            }
            html += '<div style="text-align:right;padding:12px;"><button type="button" class="layui-btn" id="btnDoPrint">打印</button></div>';
            $('#reslist').html(html);
            $('#btnDoPrint').on('click', function () { window.print(); });
        }

        if (uid) {
            app.post(api.personel.queryUserEducation, { 'userEducation.uid': uid }, function (res) { eduRows = res.userEducations || []; maybeRender(); }, function () { maybeRender(); });
            app.post(api.personel.queryUserOperation, { 'userOperation.uid': uid }, function (res) { opRows = res.userOperations || []; maybeRender(); }, function () { maybeRender(); });
        } else {
            maybeRender();
        }
    });
});
}); // end app.ready
