/** userContract.js —— 员工合同（queryUserContract + add/update/delete + sign/expire/filing + 公司签/员工签）
 * 从 url ?userId=&uid= 取参数（旧代码用 params.personel.userId/uid + params.historyPage） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { userId: null, uid: null, scid: null, editIndex: null, signetIndex: null, user: null };

    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    state.userId = getUrlParam('userId');
    state.uid = getUrlParam('uid');

    var statusMap = { 0: '初始', 1: '有效', 2: '失效', 3: '归档', 4: '已签' };
    function stStatus(d) {
        var cls = { 0: 'layui-bg-blue', 1: 'layui-bg-green', 2: 'layui-bg-gray', 3: 'layui-bg-cyan', 4: 'layui-bg-orange' };
        return '<span class="layui-badge ' + (cls[d.status] != null ? cls[d.status] : '') + '">' + (statusMap[d.status] != null ? statusMap[d.status] : '---') + '<\/span>';
    }

    app.post(api.data.querySignet, { 'signet.type': 2 }, function (res) {
        app.bindData($('#signet'), res.signets, 'sid', 'name', true, function () { form.render('select'); });
    });

    app.post(api.personel.queryUserByUserId, { 'user.userId': state.userId }, function (res) {
        state.user = res.user;
        var u = res.user || {};
        var phone = u.phone ? String(u.phone).replace(/^(\d{3})\d+(\d{4})$/, '$1****$2') : '';
        var identity = u.identity ? String(u.identity).replace(/(.{6}).*(.{4})/, '$1********$2') : '暂无';
        $('#userInfo .layui-card-body').html(
            '<div><b>姓名：</b>' + (u.currentName || '') + '</div>' +
            '<div><b>电话：</b>' + phone + '</div>' +
            '<div><b>身份证：</b>' + identity + '</div>' +
            '<div><b>职位：</b>' + (u.duty ? u.duty.name : '') + '</div>' +
            '<div><b>角色：</b>' + (u.role ? u.role.name : '') + '</div>'
        );
    });

    laydate.render({ elem: '#editForm [name="signTime"]' });
    laydate.render({ elem: '#editForm [name="startTime"]' });
    laydate.render({ elem: '#editForm [name="endTime"]' });

    initTable(); query();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 120 },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'signTime', title: '签订时间', width: 120 },
                { field: 'startTime', title: '开始时间', width: 120 },
                { field: 'endTime', title: '结束时间', width: 120 },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'status', title: '状态', width: 90, templet: stStatus },
                { field: 'comment', title: '说明', minWidth: 160 },
                { title: '操作', width: 480, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, d = obj.data;
            if (ev === 'edit') openEdit(d);
            else if (ev === 'view') viewContract(d);
            else if (ev === 'sign') affix(d);
            else if (ev === 'expire') expire(d);
            else if (ev === 'companySign') openSignet(d);
            else if (ev === 'userSign') userSign(d);
            else if (ev === 'filing') filing(d);
        });
    }

    function query() {
        app.post(api.personel.queryUserContract, { 'userContract.uid': state.uid }, function (res) {
            table.reload('resultTable', { data: res.userContracts || [] });
        });
    }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.scid = null;
        if (d) {
            state.scid = d.ucid;
            $('#editForm [name="ucid"]').val(d.ucid);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="signTime"]').val(d.signTime);
            $('#editForm [name="startTime"]').val(d.startTime);
            $('#editForm [name="endTime"]').val(d.endTime);
            $('#editForm [name="status"]').val(d.status);
            $('#editForm [name="comment"]').val(d.comment);
        }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑合同' : '添加合同', content: $('#editBox'), area: ['560px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'userContract.uid': state.uid,
            'userContract.name': $('#editForm [name="name"]').val(),
            'userContract.signTime': $('#editForm [name="signTime"]').val(),
            'userContract.startTime': $('#editForm [name="startTime"]').val(),
            'userContract.endTime': $('#editForm [name="endTime"]').val(),
            'userContract.status': $('#editForm [name="status"]').val(),
            'userContract.comment': $('#editForm [name="comment"]').val()
        };
        var apiDef = state.scid ? (opt['userContract.ucid'] = state.scid, api.personel.updateUserContract) : api.personel.addUserContract;
        app.post(apiDef, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(); });
    }

    function viewContract(d) { app.post(api.personel.viewUserContract, { 'userContract.ucid': d.ucid }, function (res) { if (res.redirect) layer.open({ type: 2, title: '合同查看', content: res.redirect, area: ['90%', '90%'] }); }); }
    function affix(d) { app.showConfirm('是否已签合同?', function () { app.post(api.personel.affixUserContract, { 'userContract.ucid': d.ucid }, function () { query(); }); }); }
    function expire(d) { app.showConfirm('是否失效合同?', function () { app.post(api.personel.expireUserContract, { 'userContract.ucid': d.ucid }, function () { query(); }); }); }
    function filing(d) { app.showConfirm('是否归档?', function () { app.post(api.personel.filingUserContract, { 'userContract.ucid': d.ucid }, function () { query(); }); }); }
    function userSign(d) { app.post(api.personel.signUserContractForUser, { 'userContract.ucid': d.ucid }, function (res) { if (res.redirect) layer.open({ type: 2, title: '员工签', content: res.redirect, area: ['90%', '90%'] }); }); }
    function openSignet(d) {
        state.scid = d.ucid;
        state.signetIndex = layer.open({ type: 1, title: '公司签', content: $('#signetBox'), area: ['420px', 'auto'] });
    }
    function doSignet() {
        var sid = $('#signet').val();
        app.post(api.data.querySignetBySid, { 'signet.sid': sid }, function (res) {
            var signet = res.signet;
            if (!signet || !signet.no) { app.showAlert(app.error, '签章不存在'); return; }
            app.post(api.personel.signUserContractForCompany, {
                'userContract.ucid': state.scid,
                'signet.sid': signet.sid,
                'signet.signno': signet.signno,
                'signet.keyword': signet.keyword,
                'signet.signid': signet.signid
            }, function () { layer.close(state.signetIndex); state.signetIndex = null; });
        });
    }

    function doRegist() { app.showConfirm('确定要注册吗?', function () { app.post(api.personel.registUser, { 'user.uid': state.uid }, function () { app.showAlert(app.success, '注册成功'); }); }); }
    function doAuth() { app.post(api.personel.authUser, { 'user.uid': state.uid }, function (res) { if (res.redirect) layer.open({ type: 2, title: '认证', content: res.redirect, area: ['640px', '480px'] }); }); }
    function doSignate() { app.post(api.personel.signateUser, { 'user.uid': state.uid }, function (res) { if (res.redirect) layer.open({ type: 2, title: '签名', content: res.redirect, area: ['640px', '480px'] }); }); }
    function doConfirm() { app.post(api.personel.confirmUser, { 'user.uid': state.uid }, function () { query(); }); }
    function doReset() { app.showConfirm('是否重置人员认证', function () { app.post(api.personel.resetUser, { 'user.uid': state.uid }); }); }

    $('#btnBack').on('click', function () { history.back(); });
    $('#btnAdd').on('click', function () {
        if (state.user && state.user.authStatus == 0) { app.showAlert(app.warning, '人员未认证'); return; }
        layer.open({ type: 2, title: '创建合同', content: '../../views/personnel/userContract4create.html?uid=' + state.uid, area: ['80%', '80%'], end: function () { query(); } });
    });
    $('#btnRegist').on('click', doRegist);
    $('#btnAuth').on('click', doAuth);
    $('#btnSignate').on('click', doSignate);
    $('#btnConfirm').on('click', doConfirm);
    $('#btnReset').on('click', doReset);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnSignet').on('click', doSignet);
    $('#btnSignetCancel').on('click', function () { layer.close(state.signetIndex); state.signetIndex = null; });
});
}); // end app.ready
