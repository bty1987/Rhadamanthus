/** user2edit.js —— 员工编辑（queryUserInfoByUserId 回填 + addUser/updateUser）
 * 父页 popup 打开，从 url ?userId= 取（无则新增） */
app.ready(function () {
layui.use(['form', 'layer', 'laydate', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }
    var userId = getUrlParam('userId');
    var isEdit = !!userId;

    var getProp = { '0': true, '1': false, 'true': 0, 'false': 1 };
    var politicalMap = [{ key: 0, value: '群众' }, { key: 1, value: '党员' }, { key: 2, value: '团员' }, { key: 3, value: '民主党派' }];
    var rankSeqMap = [{ key: 'S', value: 'S' }, { key: 'A', value: 'A' }, { key: 'B', value: 'B' }, { key: 'C', value: 'C' }, { key: 'D', value: 'D' }];
    var rankLvlMap = [{ key: '1', value: '1' }, { key: '2', value: '2' }, { key: '3', value: '3' }];
    var formMap = [{ key: 0, value: '产值' }, { key: 1, value: '非产值' }];
    var householdMap = [{ key: 0, value: '城镇' }, { key: 1, value: '农村' }];
    var statusMap = [{ key: 0, value: '在职' }, { key: 1, value: '离职' }, { key: 2, value: '休假' }, { key: 3, value: '其他' }];

    app.bindData($('#userForm [name="political"]'), politicalMap, 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#userForm [name="rank_sequence"]'), rankSeqMap, 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#userForm [name="rank_level"]'), rankLvlMap, 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#userForm [name="form"]'), formMap, 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#userForm [name="householdType"]'), householdMap, 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#userForm [name="status"]'), statusMap, 'key', 'value', true, function () { form.render('select'); });

    app.post(api.system.queryRole, { timestamp: Date.now() }, function (res) {
        app.bindData($('#userForm [name="role.rid"]'), res.roleList, 'rid', 'name', true, function () { form.render('select'); });
    }, null, false);
    app.post(api.communion.queryDepartmentType, {}, function (res) {
        app.bindData($('#userForm [name="rank_sequence"]'), null, null, null); // placeholder
    });

    laydate.render({ elem: '#userForm [name="entryTime"]' });

    // 拼音搜索：推荐人 fangliner.userId
    var ta = null;
    $('#userForm [name="fangliner.userId"]').on('input', function () {
        var kw = $.trim($(this).val()); clearTimeout(ta);
        $('#userForm [name="fangliner.userIdHidden"]').val('');
        if (!kw) return;
        ta = setTimeout(function () {
            app.post(api.personel.queryUserByPinyin, { pinyinName: kw, 'departmentType.name': '', 'user.status': 0 }, function (res) {
                var list = res.users || [];
                if (list.length === 1) { $('#userForm [name="fangliner.userId"]').val(list[0].currentName || list[0].userName); $('#userForm [name="fangliner.userId"]').attr('data-uid', list[0].userId); }
            });
        }, 300);
    });

    if (isEdit) {
        app.post(api.personel.queryUserInfoByUserId, { 'userInfo.user.userId': userId }, function (res) {
            var u = res.userInfo || {}; var usr = u.user || {};
            $('#userForm [name="userId"]').val(usr.userId);
            $('#userForm [name="oldUserId"]').val(usr.oldUserId);
            $('#userForm [name="loginId"]').val(usr.loginId);
            $('#userForm [name="userName"]').val(usr.userName);
            $('#userForm [name="currentName"]').val(usr.currentName);
            $('#userForm [name="gender"]').val(usr.gender);
            $('#userForm [name="identity"]').val(usr.identity);
            $('#userForm [name="phone"]').val(usr.phone);
            $('#userForm [name="entryTime"]').val(u.entryTime);
            if (usr.role) $('#userForm [name="role.rid"]').val(usr.role.rid);
            if (usr.dept) $('#userForm [name="dept.did"]').val(usr.dept.did);
            if (usr.duty) $('#userForm [name="duty.did"]').val(usr.duty.did);
            $('#userForm [name="status"]').val(usr.status);
            if (u.rank) { $('#userForm [name="rank_sequence"]').val(u.rank.substr(0, 1)); $('#userForm [name="rank_level"]').val(u.rank.substr(1, 2)); }
            $('#userForm [name="form"]').val(u.form);
            if (u.fangliner) $('#userForm [name="fangliner.userId"]').val(u.fangliner.currentName).attr('data-uid', u.fangliner.userId);
            $('#userForm [name="height"]').val(u.height);
            $('#userForm [name="weight"]').val(u.weight);
            $('#userForm [name="nation"]').val(u.nation);
            $('#userForm [name="political"]').val(u.political);
            $('#userForm [name="jobYears"]').val(u.jobYears);
            $('#userForm [name="address"]').val(u.address);
            $('#userForm [name="hometownAddress"]').val(u.hometownAddress);
            $('#userForm [name="householdType"]').val(u.householdType);
            $('#userForm [name="emergencyMan"]').val(u.emergencyMan);
            $('#userForm [name="emergencyPhone"]').val(u.emergencyPhone);
            $('#userForm [name="qq"]').val(u.qq);
            $('#userForm [name="wechat"]').val(u.wechat);
            $('#userForm [name="email"]').val(u.email);
            $('#userForm [name="lover"]').val(u.lover);
            $('#userForm [name="hometownPlace"]').val(u.hometownPlace);
            $('#userForm [name="salary"]').val(u.salary);
            $('#userForm [name="palary"]').val(u.palary);
            $('#userForm [name="bank"]').val(u.bank);
            $('#userForm [name="bankCardNum"]').val(u.bankCardNum);
            $('#userForm [name="comment"]').val(u.comment);
            form.render();
        });
    }

    function doSave() {
        if (app.validate('userForm')) return;
        var fanglinerUid = $('#userForm [name="fangliner.userId"]').attr('data-uid') || '';
        var opt = {
            'userInfo.user.userId': userId || '',
            'userInfo.user.oldUserId': $('#userForm [name="oldUserId"]').val(),
            'userInfo.user.loginId': $('#userForm [name="loginId"]').val(),
            'userInfo.user.userName': $('#userForm [name="userName"]').val(),
            'userInfo.user.currentName': $('#userForm [name="currentName"]').val(),
            'userInfo.user.gender': $('#userForm [name="gender"]').val(),
            'userInfo.user.identity': $('#userForm [name="identity"]').val(),
            'userInfo.user.phone': $('#userForm [name="phone"]').val(),
            'userInfo.user.status': $('#userForm [name="status"]').val(),
            'userInfo.user.dept.did': $('#userForm [name="dept.did"]').val(),
            'userInfo.user.duty.did': $('#userForm [name="duty.did"]').val(),
            'userInfo.user.role.rid': $('#userForm [name="role.rid"]').val(),
            'userInfo.rank': $('#userForm [name="rank_sequence"]').val() + $('#userForm [name="rank_level"]').val(),
            'userInfo.form': $('#userForm [name="form"]').val(),
            'userInfo.fangliner.userId': fanglinerUid,
            'userInfo.entryTime': $('#userForm [name="entryTime"]').val(),
            'userInfo.height': $('#userForm [name="height"]').val(),
            'userInfo.weight': $('#userForm [name="weight"]').val(),
            'userInfo.nation': $('#userForm [name="nation"]').val(),
            'userInfo.political': $('#userForm [name="political"]').val(),
            'userInfo.jobYears': $('#userForm [name="jobYears"]').val(),
            'userInfo.address': $('#userForm [name="address"]').val(),
            'userInfo.hometownAddress': $('#userForm [name="hometownAddress"]').val(),
            'userInfo.householdType': $('#userForm [name="householdType"]').val(),
            'userInfo.emergencyMan': $('#userForm [name="emergencyMan"]').val(),
            'userInfo.emergencyPhone': $('#userForm [name="emergencyPhone"]').val(),
            'userInfo.qq': $('#userForm [name="qq"]').val(),
            'userInfo.wechat': $('#userForm [name="wechat"]').val(),
            'userInfo.email': $('#userForm [name="email"]').val(),
            'userInfo.lover': $('#userForm [name="lover"]').val(),
            'userInfo.hometownPlace': $('#userForm [name="hometownPlace"]').val(),
            'userInfo.salary': $('#userForm [name="salary"]').val(),
            'userInfo.palary': $('#userForm [name="palary"]').val(),
            'userInfo.bank': $('#userForm [name="bank"]').val(),
            'userInfo.bankCardNum': $('#userForm [name="bankCardNum"]').val(),
            'userInfo.comment': $('#userForm [name="comment"]').val()
        };
        var apiDef = isEdit ? api.personel.updateUser : api.personel.addUser;
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '操作成功');
            var idx = (window.parent && window.parent.layer) ? window.parent.layer.getFrameIndex(window.name) : null;
            if (idx != null) window.parent.layer.close(idx);
        });
    }

    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () {
        var idx = (window.parent && window.parent.layer) ? window.parent.layer.getFrameIndex(window.name) : null;
        if (idx != null) window.parent.layer.close(idx);
    });
});
}); // end app.ready
