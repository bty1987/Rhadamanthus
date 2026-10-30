/** app/js/system/password2change.js —— 修改密码
 * 密码 MD5 加密后提交，走 changePassword.do（communion 服务，需认证）
 * 对齐旧 password2change.js：oldPassword + rePassword，两次新密码一致才提交 */
app.ready(function () {
layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer, $ = layui.jquery;

    $('#btnSave').on('click', function () {
        if (app.validate('changePasswordForm')) return;

        var oldPwd = $('#oldPassword').val();
        var newPwd = $('#password').val();
        var rePwd = $('#rePassword').val();

        // 校验：新密码至少 6 位
        if (newPwd.length < 6) { app.showAlert(app.warning, '新密码至少6位'); return; }
        // 校验：两次新密码一致
        if (newPwd !== rePwd) { app.showAlert(app.warning, '两次输入的新密码不一致'); return; }
        // 校验：新旧不能相同
        if (oldPwd === newPwd) { app.showAlert(app.warning, '新密码不能与原密码相同'); return; }

        // MD5 加密（与旧 flcry 一致：大写十六进制）
        var params = {
            'password': AppMD5.hex(oldPwd),
            'rePassword': AppMD5.hex(newPwd)
        };

        app.post({ url: 'changePassword.do', server: 'communion' }, params, function (res) {
            app.showAlert(app.success, '密码修改成功，请重新登录');
            setTimeout(function () { app.logout(); }, 2000);
        });
    });
});
}); // end app.ready
