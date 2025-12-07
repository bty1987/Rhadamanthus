jQuery(function($) {
    var loginurl = "login.do";
    var count = 0;
    var QRCode = '/QRCode.do';
    var queryVode = '/queryVode.do';
    var params = {};

    // ========== 初始化配置 ==========
    initConfig();

    // ========== Tab 切换 ==========
    initTabSwitch();

    // ========== 密码显示/隐藏切换 ==========
    initPasswordToggle();

    // ========== 验证码刷新 ==========
    initVerifyCode();

    // ========== 二维码登录 ==========
    initQRCodeLogin();

    // ========== 表单提交 ==========
    $("#loginBtn").on('click', login);
    $("#experienceBtn").on('click', function() {
        // 立即体验功能 - 可以链接到 Demo 或注册页
        alert('请联系管理员开通账号');
    });

    // ========== 回车登录 ==========
    document.onkeydown = function(e) {
        var _e = e || event;
        if (_e.keyCode == 13 && $('#passwordPanel').hasClass('active')) {
            login();
            return false;
        }
    };

    /**
     * 初始化配置
     */
    function initConfig() {
        // 检查是否启用 Demo 模式
        config.demo && (
            config.server = 'result/',
            config.communion = 'result/',
            config.media = 'result/',
            QRCode = '/QRCode.json',
            queryVode = '/queryVode.json'
        );

        // 如果不是内网环境,获取服务器地址
        if (!config.intranet && !config.demo) {
            $.ajax({
                url: 'https://www.fanglinserver.com/communion.do',
                data: {},
                type: "post",
                dataType: "json",
                async: false,
                success: function(res) {
                    config.communion = res.communion;
                    setCookie('communion', res.communion, config.timeout);
                }
            });
        }
    }

    /**
     * Tab 切换逻辑
     */
    function initTabSwitch() {
        $('.login-tab').on('click', function() {
            var $this = $(this);
            var tab = $this.data('tab');

            // 切换 Tab 样式
            $('.login-tab').removeClass('active');
            $this.addClass('active');

            // 切换面板
            $('.login-form-panel').removeClass('active');
            if (tab === 'qrcode') {
                $('#qrcodePanel').addClass('active');
                // 重新加载钉钉二维码
                initQRCodeLogin();
            } else if (tab === 'wechat') {
                $('#wechatPanel').addClass('active');
                // 重新加载微信二维码
                initWechatLogin();
            } else {
                $('#passwordPanel').addClass('active');
            }
        });
    }

    /**
     * 密码显示/隐藏切换
     */
    function initPasswordToggle() {
        $('#passwordToggle').on('click', function() {
            var $icon = $(this);
            var $input = $('#password');

            if ($input.attr('type') === 'password') {
                $input.attr('type', 'text');
                $icon.removeClass('icon-eye-slash').addClass('icon-eye');
            } else {
                $input.attr('type', 'password');
                $icon.removeClass('icon-eye').addClass('icon-eye-slash');
            }
        });
    }

    /**
     * 初始化验证码
     */
    function initVerifyCode() {
        // 点击刷新验证码
        $("#Verify").click(function() {
            refreshVerifyCode();
        });

        // 首次加载验证码
        refreshVerifyCode();
    }

    /**
     * 刷新验证码
     */
    function refreshVerifyCode() {
        if (config.demo) {
            $("#Verify").attr("src", 'images/verifyCode.jpg');
            return;
        }

        $.ajax({
            url: config.communion + queryVode,
            type: "POST",
            dataType: "json",
            success: function(data) {
                params.securityCode = data.securityCode.replace(/[\r\n]/g, "");
                $("#Verify").attr("src", config.communion + "/verifyCode.do?timestamp=" + new Date().getTime() + "&securityCode=" + data.securityCode.replace(/[\r\n]/g, "").replace(/\+/g, "%2B"));
            },
            error: function() {
                // 使用本地验证码作为降级方案
                $("#Verify").attr("src", "verifyCode.do?timestamp=" + new Date().getTime());
            }
        });
    }

    /**
     * 初始化二维码登录
     */
    function initQRCodeLogin() {
        count = 0;
        $('#qrcodeRefresh').addClass('hide');

        if (config.demo) {
            $('#qrcode img').attr('src', 'images/verifyCode.jpg').removeClass('hide');
            return;
        }

        $.ajax({
            url: config.communion + QRCode + "?timestamp=" + new Date().getTime() + "&prefix=" + (config.prefix || ''),
            type: "GET",
            dataType: "json",
            success: function(data) {
                $('#qrcode img').attr('src', data.QRCode).removeClass('hide');

                var loginFlag = data.loginInfo && data.loginInfo.loginFlag;
                if (!config.demo && loginFlag) {
                    checkQRLogin(loginFlag);
                }
            },
            error: function() {
                $('#qrcode img').addClass('hide');
                $('#qrcodeRefresh').html('获取二维码失败<br><span>点击刷新</span>').removeClass('hide');
            }
        });

        // 刷新二维码
        $('#qrcodeRefresh').on('click', 'span', function() {
            initQRCodeLogin();
        });
    }

    /**
     * 检查二维码登录状态（钉钉）
     */
    function checkQRLogin(flag) {
        if (count >= 30) {
            $('#qrcodeRefresh').html('二维码已失效<br><span>点击刷新</span>').removeClass('hide');
            return;
        }

        $.ajax({
            url: config.communion + "/queryLoginInfoByLoginFlag.do",
            type: "POST",
            dataType: "json",
            data: { "loginInfo.loginFlag": flag },
            success: function(data) {
                count++;
                var statusCode = data.loginInfo && data.loginInfo.code;

                if (statusCode == -1) {
                    // 等待扫码
                    setTimeout(function() {
                        checkQRLogin(flag);
                    }, 4000);
                } else if (statusCode == 0) {
                    // 登录成功
                    var authentication = data.loginInfo.authentication.replace(/[\r\n]/g, "");
                    setCookie("authentication", authentication, config.timeout);
                    setCookie("loginTime", new Date().getTime(), config.timeout);
                    window.location.href = "index.html?timestamp=" + new Date().getTime();
                } else {
                    // 登录失败
                    var message = (data.loginInfo && data.loginInfo.message) || '登录失败';
                    $('#qrcodeRefresh').html(message + '<br><span>点击刷新</span>').removeClass('hide');
                }
            },
            error: function() {
                $('#qrcodeRefresh').html('网络错误<br><span>点击刷新</span>').removeClass('hide');
            }
        });
    }

    /**
     * 初始化微信扫码登录
     */
    function initWechatLogin() {
        count = 0;
        $('#wechatRefresh').addClass('hide');

        if (config.demo) {
            $('#wxcode img').attr('src', 'images/verifyCode.jpg').removeClass('hide');
            return;
        }

        $.ajax({
            url: config.communion + QRCode + "?timestamp=" + new Date().getTime() + "&prefix=" + (config.prefix || '') + "&type=1",
            type: "GET",
            dataType: "json",
            success: function(data) {
                $('#wxcode img').attr('src', data.QRCode).removeClass('hide');

                var loginFlag = data.loginInfo && data.loginInfo.loginFlag;
                if (!config.demo && loginFlag) {
                    checkWechatLogin(loginFlag);
                }
            },
            error: function() {
                $('#wxcode img').addClass('hide');
                $('#wechatRefresh').html('获取二维码失败<br><span>点击刷新</span>').removeClass('hide');
            }
        });

        // 刷新二维码
        $('#wechatRefresh').on('click', 'span', function() {
            initWechatLogin();
        });
    }

    /**
     * 检查微信扫码登录状态
     */
    function checkWechatLogin(flag) {
        if (count >= 30) {
            $('#wechatRefresh').html('二维码已失效<br><span>点击刷新</span>').removeClass('hide');
            return;
        }

        $.ajax({
            url: config.communion + "/queryLoginInfoByLoginFlag.do",
            type: "POST",
            dataType: "json",
            data: { "loginInfo.loginFlag": flag },
            success: function(data) {
                count++;
                var statusCode = data.loginInfo && data.loginInfo.code;

                if (statusCode == -1) {
                    // 等待扫码
                    setTimeout(function() {
                        checkWechatLogin(flag);
                    }, 4000);
                } else if (statusCode == 0) {
                    // 登录成功
                    var authentication = data.loginInfo.authentication.replace(/[\r\n]/g, "");
                    setCookie("authentication", authentication, config.timeout);
                    setCookie("loginTime", new Date().getTime(), config.timeout);
                    window.location.href = "index.html?timestamp=" + new Date().getTime();
                } else {
                    // 登录失败
                    var message = (data.loginInfo && data.loginInfo.message) || '登录失败';
                    $('#wechatRefresh').html(message + '<br><span>点击刷新</span>').removeClass('hide');
                }
            },
            error: function() {
                $('#wechatRefresh').html('网络错误<br><span>点击刷新</span>').removeClass('hide');
            }
        });
    }

    /**
     * 登录函数（挑战-响应认证）
     */
    function login() {
        if (config.demo) {
            // Demo 模式直接跳转
            setCookie("loginTime", new Date().getTime(), config.timeout);
            window.location.href = "index.html?timestamp=" + new Date().getTime();
            return;
        }

        var userId = $("#userId").val().trim();
        var password = $("#password").val();
        var verifyCode = $("#nowCode").val().trim();

        // 表单验证
        if (!userId) {
            showError("请输入登录账号");
            return;
        }
        if (!password) {
            showError("请输入密码");
            return;
        }
        if (!verifyCode) {
            showError("请输入验证码");
            return;
        }

        // 清空错误提示
        $("#errorMsg").html('');

        // 第一步：请求登录挑战（nonce）
        $.ajax({
            type: "POST",
            dataType: "json",
            url: config.communion + "requestLoginChallenge.do",
            data: { userId: userId },
            success: function(data) {
                if (data.errorCode != 0) {
                    showError(data.errorMsg || "获取登录挑战失败");
                    return;
                }

                var nonce = data.nonce;

                // 第二步：计算响应哈希
                var passwordMD5 = getMD5(password);
                var responseHash = getMD5(passwordMD5 + nonce);

                // 第三步：发送响应哈希进行登录
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: config.communion + "doLogin.do",
                    data: {
                        userId: userId,
                        password: passwordMD5,  // 使用 MD5 密码
                        verifyCode: verifyCode,
                        company: config.company || '',
                        securityCode: params.securityCode || ''
                    },
                    success: function(data) {
                        if (data.errorCode == 1) {
                            // 验证码错误
                            showError(data.errorMsg);
                            refreshVerifyCode();
                        } else if (data.errorCode == 0) {
                            // 登录成功
                            var authentication = data.authentication.replace(/[\r\n]/g, "");
                            setCookie("authentication", authentication, config.timeout);
                            setCookie("loginTime", new Date().getTime(), config.timeout);
                            setCookie("versionCode", config.versionCode, config.timeout);
                            document.location.href = "index.html?timestamp=" + new Date().getTime();
                        } else {
                            // 其他错误（账号或密码错误）
                            showError(data.errorMsg);
                            refreshVerifyCode();
                        }
                    },
                    error: function() {
                        showError("网络错误，请重试");
                    }
                });
            },
            error: function() {
                showError("网络错误，请重试");
            }
        });
    }

    /**
     * 显示错误信息
     */
    function showError(message) {
        $("#errorMsg").html(message);
    }

    /**
     * 获取 MD5 函数
     */
    function getMD5(str) {
        // 方式1：使用 flcry 函数（如果已加载 utils.js）
        if (typeof flcry !== 'undefined') {
            return flcry(str).toUpperCase();
        }
        // 方式2：使用 CryptoJS.MD5（如果已加载 crypto.min.js）
        else if (typeof CryptoJS !== 'undefined' && CryptoJS.MD5) {
            return CryptoJS.MD5(str).toString().toUpperCase();
        }
        // 方式3：如果都不可用，抛出错误
        else {
            alert('MD5函数不可用，请确保加载了必要的加密库');
            throw new Error('MD5 function not available');
        }
    }

    /**
     * 设置 Cookie
     */
    function setCookie(cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    }
});
