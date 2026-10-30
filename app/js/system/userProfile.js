/** app/js/system/userProfile.js —— 个人资料（当前用户信息编辑 + 头像上传）
 * 接口：queryUserForSelfByUserId（取当前用户）+ updateUserForBaseInfo（保存）
 * 头像：uploadImage → resUrl 填入 picture 字段 + 预览
 * 字段：userPhoto/age/phone/qq/wechat/email/emergencyMan/emergencyPhone */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;
    var state = { userId: null, profile: {} };

    loadUser();

    function loadUser() {
        app.post(api.personel.queryUserForSelfByUserId, {}, function (res) {
            var info = res.userInfo || {};
            var user = info.user || {};
            state.userId = user.userId;
            state.profile = {
                userPhoto: user.userPhoto, age: info.age, phone: user.phone,
                emergencyMan: info.emergencyMan, emergencyPhone: info.emergencyPhone,
                qq: info.qq, wechat: info.wechat, email: info.email
            };
            fillForm();
        });
    }

    function fillForm() {
        var p = state.profile;
        $('#editForm [name="userId"]').val(state.userId);
        $('#editForm [name="picture"]').val(p.userPhoto || '');
        $('#editForm [name="age"]').val(p.age || '');
        $('#editForm [name="phone"]').val(p.phone || '');
        $('#editForm [name="qq"]').val(p.qq || '');
        $('#editForm [name="wechat"]').val(p.wechat || '');
        $('#editForm [name="email"]').val(p.email || '');
        $('#editForm [name="emergencyMan"]').val(p.emergencyMan || '');
        $('#editForm [name="emergencyPhone"]').val(p.emergencyPhone || '');
        if (p.userPhoto) app.showImg($('#showImg'), p.userPhoto, 100, 100);
        else $('#showImg').hide();
    }

    function doSave() {
        if (app.validate('editForm')) return;
        if (!state.userId) { app.showAlert(app.warning, '用户信息加载中，请稍后再试'); return; }
        var opt = {
            'userInfo.user.userId': state.userId,
            'userInfo.user.userPhoto': $('#editForm [name="picture"]').val(),
            'userInfo.user.phone': $('#editForm [name="phone"]').val(),
            'userInfo.age': $('#editForm [name="age"]').val(),
            'userInfo.emergencyMan': $('#editForm [name="emergencyMan"]').val(),
            'userInfo.emergencyPhone': $('#editForm [name="emergencyPhone"]').val(),
            'userInfo.qq': $('#editForm [name="qq"]').val(),
            'userInfo.wechat': $('#editForm [name="wechat"]').val(),
            'userInfo.email': $('#editForm [name="email"]').val()
        };
        app.post(api.personel.updateUserForBaseInfo, opt, function () {
            // 同步本地缓存，便于重置
            state.profile.userPhoto = opt['userInfo.user.userPhoto'];
            state.profile.age = opt['userInfo.age'];
            state.profile.phone = opt['userInfo.user.phone'];
            state.profile.emergencyMan = opt['userInfo.emergencyMan'];
            state.profile.emergencyPhone = opt['userInfo.emergencyPhone'];
            state.profile.qq = opt['userInfo.qq'];
            state.profile.wechat = opt['userInfo.wechat'];
            state.profile.email = opt['userInfo.email'];
            app.showAlert(app.success, '操作成功');
        });
    }

    // 头像上传
    $('#btnUpload').on('click', function () {
        app.uploadImage({
            elem: '#btnUpload',
            data: { 'uploadType': 0, 'name': 'oss-fanglin-erp' },
            done: function (res) {
                if (res.errorCode == 0) {
                    var url = res.name || res.resUrl || '';
                    $('#editForm [name="picture"]').val(url);
                    app.showImg($('#showImg'), url, 100, 100);
                    app.showAlert(app.success, '上传成功');
                } else {
                    app.showAlert(app.error, res.errorMsg || '上传失败');
                }
            },
            error: function () { app.showAlert(app.error, '上传失败'); }
        });
    });

    $('#btnRemoveImg').on('click', function () {
        $('#editForm [name="picture"]').val('');
        $('#showImg').attr('src', '').hide();
    });

    $('#btnSave').on('click', doSave);
    $('#btnReset').on('click', function () { fillForm(); });
});
}); // end app.ready
