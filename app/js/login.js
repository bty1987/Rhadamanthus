/**
 * app/js/login.js —— 登录页逻辑（挑战-响应 MD5）
 *
 * 对齐旧 WebContent/js/login.js 的核心流程：
 *   1. 内外网/communion 地址初始化（外网时 communion.do 回填）
 *   2. 验证码获取/刷新（queryVode.do + verifyCode.do）
 *   3. 登录：requestLoginChallenge.do → MD5(password)+nonce → doLogin.do → authentication
 *   4. 成功后写 Cookie(authentication + loginTime)，跳 index.html
 *
 * 只用 layui（form / layer / 内置 jquery），不依赖 ace/bootstrap。
 */
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.jquery;
    var cfg = app.config;

    var QRCode = '/QRCode.do';
    var queryVode = '/queryVode.do';
    var pageData = { securityCode: '' };

    // ========== 初始化 ==========
    initConfig();
    initVerifyCode();
    initLoginTabs();

    // 回车提交
    $('#loginForm').on('keydown', function (e) {
        if (e.keyCode === 13) { e.preventDefault(); form.submit(); }
    });

    // 验证码点击刷新
    $('#Verify').on('click', refreshVerifyCode);

    // ====================================================================
    // 登录方式切换（账号密码 / 扫码），扫码面板首次打开时拉二维码
    // ====================================================================
    var qrStarted = false;

    function initLoginTabs() {
        $('.login-tab').on('click', function () {
            var tab = $(this).data('tab');
            $('.login-tab').removeClass('active');
            $(this).addClass('active');
            $('.login-panel').removeClass('active');
            if (tab === 'qrcode') {
                $('#qrcodePanel').addClass('active');
                if (!qrStarted) { qrStarted = true; initQRCodeLogin(); }
            } else {
                $('#passwordPanel').addClass('active');
            }
        });
        // 点遮罩刷新二维码
        $('#qrMask').on('click', function () { initQRCodeLogin(); });
    }

    // ====================================================================
    // 扫码登录（钉钉二维码），对齐旧 login.js initQRCodeLogin/checkQRLogin
    // ====================================================================
    var qrPollCount = 0;

    function initQRCodeLogin() {
        qrPollCount = 0;
        $('#qrMask').removeClass('show').find('#qrMaskText').text('二维码加载中...');
        if (cfg.demo) {
            $('#qrImg').attr('src', 'images/verifyCode.jpg').show();
            return;
        }
        $.ajax({
            url: cfg.communion + '/QRCode.do?timestamp=' + Date.now() + '&prefix=' + (cfg.prefix || ''),
            type: 'GET', dataType: 'json',
            success: function (data) {
                $('#qrImg').attr('src', data.QRCode).show();
                var flag = data.loginInfo && data.loginInfo.loginFlag;
                if (flag) checkQRLogin(flag);
            },
            error: function () {
                $('#qrImg').hide();
                $('#qrMask').addClass('show').find('#qrMaskText')
                    .html('二维码获取失败<br><span>点击刷新</span>');
            }
        });
    }

    function checkQRLogin(flag) {
        if (qrPollCount >= 30) {
            $('#qrMask').addClass('show').find('#qrMaskText')
                .html('二维码已失效<br><span>点击刷新</span>');
            return;
        }
        $.ajax({
            url: cfg.communion + '/queryLoginInfoByLoginFlag.do',
            type: 'POST', dataType: 'json',
            data: { 'loginInfo.loginFlag': flag },
            success: function (data) {
                qrPollCount++;
                var code = data.loginInfo && data.loginInfo.code;
                if (code == -1) {
                    setTimeout(function () { checkQRLogin(flag); }, 4000);   // 等待扫码
                } else if (code == 0) {
                    // 扫码成功：写 Cookie 跳首页（与密码登录同一出口）
                    var auth = (data.loginInfo.authentication || '').replace(/[\r\n]/g, '');
                    app.cookie.set('authentication', auth, cfg.timeout);
                    app.cookie.set('loginTime', Date.now(), cfg.timeout);
                    location.href = 'index.html?timestamp=' + Date.now();
                } else {
                    var msg = (data.loginInfo && data.loginInfo.message) || '登录失败';
                    $('#qrMask').addClass('show').find('#qrMaskText')
                        .html(msg + '<br><span>点击刷新</span>');
                }
            },
            error: function () {
                $('#qrMask').addClass('show').find('#qrMaskText')
                    .html('网络错误<br><span>点击刷新</span>');
            }
        });
    }

    // ========== 提交 ==========
    form.on('submit(doLogin)', function (data) {
        doLogin(data.field);
        return false; // 阻止默认表单提交
    });

    // ====================================================================
    // 初始化配置：内外网/communion 地址
    // ====================================================================
    function initConfig() {
        if (cfg.demo) {
            cfg.server = 'result/';
            cfg.communion = 'result/';
            cfg.media = 'result/';
            QRCode = '/QRCode.json';
            queryVode = '/queryVode.json';
            return;
        }
        // 外网：调用 communion.do 获取公共服务地址（与旧 login.js initConfig 一致）
        if (!cfg.intranet && !cfg.communion) {
            $.ajax({
                url: 'https://service-erp.fanglin.vip/communion.do',
                data: {}, type: 'POST', dataType: 'json', async: false,
                success: function (res) {
                    cfg.communion = res.communion;
                    app.cookie.set('communion', res.communion, cfg.timeout);
                }
            });
        }
    }

    // ====================================================================
    // 验证码
    // ====================================================================
    function initVerifyCode() { refreshVerifyCode(); }

    function refreshVerifyCode() {
        if (cfg.demo) { $('#Verify').attr('src', 'images/verifyCode.jpg'); return; }
        $.ajax({
            url: cfg.communion + queryVode, type: 'POST', dataType: 'json',
            success: function (data) {
                pageData.securityCode = (data.securityCode || '').replace(/[\r\n]/g, '');
                $('#Verify').attr('src', cfg.communion + '/verifyCode.do?timestamp=' + Date.now()
                    + '&securityCode=' + pageData.securityCode.replace(/\+/g, '%2B'));
            },
            error: function () {
                $('#Verify').attr('src', 'verifyCode.do?timestamp=' + Date.now());
            }
        });
    }

    // ====================================================================
    // 登录（挑战-响应）
    // ====================================================================
    function doLogin(field) {
        var userId = $.trim(field.userId);
        var password = field.password;
        var verifyCode = $.trim(field.verifyCode);

        $('#errorMsg').text('');

        if (!userId) { showError('请输入登录账号'); return; }
        if (!password) { showError('请输入密码'); return; }
        if (!verifyCode) { showError('请输入验证码'); return; }

        if (cfg.demo) {
            app.cookie.set('loginTime', Date.now(), cfg.timeout);
            location.href = 'index.html?timestamp=' + Date.now();
            return;
        }

        // 第一步：请求挑战 nonce
        $.ajax({
            type: 'POST', dataType: 'json',
            url: cfg.communion + 'requestLoginChallenge.do',
            data: { userId: userId },
            success: function (data) {
                if (data.errorCode != 0) {
                    showError(data.errorMsg || '获取登录挑战失败');
                    return;
                }
                // 第二步：计算响应哈希（与旧逻辑一致：MD5(MD5(password) + nonce)）
                var passwordMD5 = AppMD5.hex(password);
                var responseHash = AppMD5.hex(passwordMD5 + data.nonce);

                // 第三步：提交登录
                $.ajax({
                    type: 'POST', dataType: 'json',
                    url: cfg.communion + 'doLogin.do',
                    data: {
                        userId: userId,
                        password: passwordMD5,           // MD5 密码（旧约定）
                        verifyCode: verifyCode,
                        securityCode: pageData.securityCode || '',
                        responseHash: responseHash,       // 挑战响应（增强安全，后端可选校验）
                        company: cfg.company || ''
                    },
                    success: function (res) {
                        if (res.errorCode == 0) {
                            // 登录成功：写 Cookie，跳首页
                            var auth = (res.authentication || '').replace(/[\r\n]/g, '');
                            app.cookie.set('authentication', auth, cfg.timeout);
                            app.cookie.set('loginTime', Date.now(), cfg.timeout);
                            app.cookie.set('versionCode', cfg.versionCode, cfg.timeout);
                            location.href = 'index.html?timestamp=' + Date.now();
                        } else if (res.errorCode == 1) {
                            // 验证码错误
                            showError(res.errorMsg || '验证码错误');
                            refreshVerifyCode();
                        } else {
                            showError(res.errorMsg || '账号或密码错误');
                            refreshVerifyCode();
                        }
                    },
                    error: function () { showError('网络错误，请重试'); }
                });
            },
            error: function () { showError('网络错误，请重试'); }
        });
    }

    function showError(msg) { $('#errorMsg').text(msg); }
});
