jQuery(function (a) {

    if (!parent.window.isPC) {
        $('body').css('display', 'block')
    }

    var count = 0;

    var QRCode = '/QRCode.do';
    var queryVode = '/queryVode.do';
    var params = {};

    $('#icon').attr('src', config.iconImg);
    $('#name').text(config.name);
    $('#ename').text(config.ename);

    var setCookie = function (cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    function getUrlParams() {
        var paramsObj = {};
        var paramsString = window.location.search.substring(1);
        if (paramsString) {
            var pairs = paramsString.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                var key = decodeURIComponent(pair[0]);
                var value = decodeURIComponent(pair[1] || '');
                paramsObj[key] = value;
            }
        }
        return paramsObj;
    }
    
    if(config.sso){
        $.ajax({
            url: config.server + '/registAuthCode.do',
            data: {"osstoken": config.server},
            type: "post",
            dataType: "json",
            async: false,
            success: function (res) {
                window.location.replace(res.osstoken);
            }
        });
    }else{
        $(".main-container").removeClass("hide");
        $(".slide").removeClass("hide");
    }

    var osstoken = getUrlParams()['ssoToken'];

    if(osstoken){

        var _token = osstoken;

        $.ajax({
            url: config.server + '/exchangeAuthCode.do',
            data: {"osstoken": osstoken},
            type: "post",
            dataType: "json",
            async: false,
            success: function (res) {
                window.location.replace(config.server + "/redirect.html?authentication=" + res.osstoken.replace(/[\r\n]/g,"") + "&osstoken=" + _token);
            }
        });
    }

    if (!config.intranet) {
        $.ajax({
            url: 'https://www.fanglinserver.com/communion.do',
            data: {},
            type: "post",
            dataType: "json",
            async: false,
            success: function (res) {
                config.communion = res.communion;
                setCookie('communion', res.communion, config.timeout)
            }
        });
    }

    if (parent.window.isPC) {
        pcBody();
    } else if (!location.hostname.startsWith('192.168')){
        $("#unamePwdContainer").remove();
        $("#QRLogin").remove();
        $("#WXLogin").remove();
        $("#WWLogin").remove();
    }

    config.demo && (config.server = 'result/', config.communion = 'result/', config.media = 'result/', QRCode = '/QRCode.json', queryVode = '/queryVode.json');

    verifyCode();

    var initQRCode = function () {
        $.ajax(config.communion + QRCode + "?timestamp=" + new Date().getTime() + "&prefix=" + config.prefix).done(function (data) {
            $('#qrcode img').prop('src', data.QRCode).removeClass("hide");
        }).fail(function () {
            // alert("获取二维码失败!");
            $('#qrcode img').remove();
        }).done(function (data) {
            var _flag = data.loginInfo.loginFlag;

            !config.demo && _flag && checkQRLogin(_flag);
        });
    };
    var initWXCode = function () {
        $.ajax(config.communion + QRCode + "?timestamp=" + new Date().getTime() + "&prefix=" + config.prefix + "&type=1").done(function (data) {
            $('#wxcode img').prop('src', data.QRCode).removeClass("hide");
        }).fail(function () {
            // alert("获取二维码失败!");
            $('#wxcode img').remove();
        }).done(function (data) {
            var _flag = data.loginInfo.loginFlag;

            !config.demo && _flag && checkWXLogin(_flag);
        });
    };

    var checkQRLogin = function (flag) {
        count == 30 ? $('.login_qrcode_refresh').html("您的钉钉二维码已失效, <br>请点击下方刷新按钮").removeClass('hide') : $.post(config.communion + "/queryLoginInfoByLoginFlag.do", {"loginInfo.loginFlag": flag}).done(function (data) {
            count++;
            var statusCode = data.loginInfo.code;

            if (statusCode == -1) {
                setTimeout(function () {
                    checkQRLogin(flag)
                }, 4000)
            } else if (0 == statusCode) {
                setCookie("authentication", data.loginInfo.authentication.replace(/[\r\n]/g,""), config.timeout);
                setCookie("loginTime", new Date().getTime(), config.timeout);
                if (!parent.window.isPC) {
                    window.location.href = "index.html?timestamp=" + new Date().getTime();
                } else {
                    openChildWindow();
                }
            } else {
                $('.login_qrcode_refresh').html(data.loginInfo.message).removeClass('hide')
            }
        });
    };
    var checkWXLogin = function (flag) {
        count == 30 ? $('.login_wxcode_refresh').html("您的微信二维码已失效, <br>请点击下方刷新按钮").removeClass('hide') : $.post(config.communion + "/queryLoginInfoByLoginFlag.do", {"loginInfo.loginFlag": flag}).done(function (data) {
            count++;
            var statusCode = data.loginInfo.code;

            if (statusCode == -1) {
                setTimeout(function () {
                    checkWXLogin(flag)
                }, 4000)
            } else if (0 == statusCode) {
                setCookie("authentication", data.loginInfo.authentication.replace(/[\r\n]/g,""), config.timeout);
                setCookie("loginTime", new Date().getTime(), config.timeout);
                if (!parent.window.isPC) {
                    window.location.href = "index.html?timestamp=" + new Date().getTime();
                } else {
                    openChildWindow();
                }
            } else {
                $('.login_wxcode_refresh').html(data.loginInfo.message).removeClass('hide')
            }
        });
    };

    $('.login_qrcode_text span').click(function () {
        !$('.login_qrcode_refresh').hasClass('hide') && ($('.login_qrcode_refresh').addClass('hide'), count = 0, initQRCode());
    });
    $('.login_wxcode_text span').click(function () {
        !$('.login_wxcode_refresh').hasClass('hide') && ($('.login_wxcode_refresh').addClass('hide'), count = 0, initWXCode());
    });

    initQRCode();
    initWXCode();

    $('#QRToForm').click(function () {
        $('#QRLogin').addClass('hide');
        $('#unamePwdContainer').removeClass('hide');
    });
    $('#WXToForm').click(function () {
        $('#WXLogin').addClass('hide');
        $('#unamePwdContainer').removeClass('hide');
    });
    $('#WWToForm').click(function () {
        $('#WWLogin').addClass('hide');
        $('#unamePwdContainer').removeClass('hide');
    });
    $('#FormToQR').click(function () {
        $('#unamePwdContainer').addClass('hide');
        $('#QRLogin').removeClass('hide');
    });
    $('#FormToWX').click(function () {
        $('#unamePwdContainer').addClass('hide');
        $('#WXLogin').removeClass('hide');
    });
    $('#FormToWW').click(function () {
        $('#unamePwdContainer').addClass('hide');
        $('#WWLogin').removeClass('hide');
    });
    $('#QRToWX').click(function () {
        $('#QRLogin').addClass('hide');
        $('#WXLogin').removeClass('hide');
    });
    $('#QRToWW').click(function () {
        $('#QRLogin').addClass('hide');
        $('#WWLogin').removeClass('hide');
    });
    $('#WXToQR').click(function () {
        $('#WXLogin').addClass('hide');
        $('#QRLogin').removeClass('hide');
    });
    $('#WXToWW').click(function () {
        $('#WXLogin').addClass('hide');
        $('#WWLogin').removeClass('hide');
    });
    $('#WWToQR').click(function () {
        $('#WWLogin').addClass('hide');
        $('#QRLogin').removeClass('hide');
    });
    $('#WWToWX').click(function () {
        $('#WWLogin').addClass('hide');
        $('#WXLogin').removeClass('hide');
    });

    $("#Verify").click(function () {
        verifyCode();
    });

    // 企微登录按钮点击事件
    $("#wwLoginBtn").on('click', function () {
        // 判断是否为 PC 端
        if (parent.window.isPC) {
            console.log("ispc");

            // 显示加载状态
            $('.login_wwcode_refresh').removeClass('hide').html(
                '<i class="icon-spinner icon-spin"></i> <span style="color: #38adff;">正在获取企业微信登录信息...</span>'
            );

            // 调用 socialAuthCode.do 接口
            $.ajax({
                url: config.communion + 'socialAuthCode.do',
                method: 'GET',
                timeout: 15000,
                data: {
                    "domain": "https://test-erp.fanglin.vip/xlogin.html",
                },
                success: function(response) {
                    console.log('获取企业微信登录URL响应:', response);

                     if (response.errorCode === 0 && response.domain) {
                        // 成功获取企业微信登录URL
                        var wechatUrl = response.domain;
                        console.log('成功获取的 response.domain:', wechatUrl);


                        // 后续可以实现跳转或打开新窗口
                        // window.open(wechatUrl, '_blank');

                        var subwin = null;
                        var docWindowOptions = {
                            "show": true,
                            "title": "方林信息平台",
                            "icon": "fanglinHD.png",
                            "frame": false,
                            "resizable": true,
                            "position": "center",
                            "min_width": 480,
                            "min_height": 700,
                            "show_in_taskbar": true,
                        };

                        nw.Window.open(wechatUrl, docWindowOptions, function(new_win){subwin = new_win;});

                        setInterval(function(){
                            console.log(subwin.window.authentication);

                            if(!subwin.window.authentication) return false;

                            setCookie("authentication", subwin.window.authentication.replace(/[\r\n]/g,""), config.timeout);
                            setCookie("loginTime", new Date().getTime(), config.timeout);

                            if (!parent.window.isPC) {
                                window.location.href = "index.html?timestamp=" + new Date().getTime();
                            } else {
                                subwin.close();
                                openChildWindow();
                            }
                        }, 1000);

                    } else {
                        var errorMsg = response.msg || response.errorMsg || '获取企业微信登录URL失败';
                        console.error('接口返回错误:', errorMsg);
                        $('.login_wwcode_refresh').html('<span style="color: #ff6600;">' + errorMsg + '</span>');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('获取企业微信登录URL失败:', {
                        status: status,
                        error: error,
                        responseText: xhr.responseText,
                        statusCode: xhr.status
                    });

                    var errorMsg = '网络错误，请检查连接';
                    if (xhr.status === 0) {
                        errorMsg = '网络连接失败，请检查网络';
                    } else if (xhr.status === 404) {
                        errorMsg = '登录接口不存在，请联系管理员';
                    } else if (xhr.status === 500) {
                        errorMsg = '服务器内部错误，请稍后重试';
                    }

                    $('.login_wwcode_refresh').html('<span style="color: #ff6600;">' + errorMsg + '</span>');
                }
            });

        } else {
            // 非 PC 端，隐藏提示
            console.log('非PC端，企微登录功能不可用');
        }
        return false;
    });

    $('[data-rel=popover]').popover({container: 'body'});

    $("#loginBtn").on('click', function () {
        login();
        return false;
    });

    initPage();

    if (!parent.window.isPC) {
        backgroundShaking('container', 'canvas', '#ba2454', config.shakingColor);
    }

    // $("#backgroundImage > img").attr('src', config.backgroundImg);
    // $("#backgroundImage").fullscreenBackground();
    // $("#backgroundImage").css("position", "");

    function verifyCode() {

        if (config.demo) {
            $("#Verify").attr("src", 'images/verifyCode.jpg');
            return false;
        }

        $.ajax({
            url: config.communion + queryVode,
            type: "POST",
            dataType: "json",
            success: function (data) {
                params.securityCode = data.securityCode.replace(/[\r\n]/g,"");
                $("#Verify").attr("src", config.communion + "/verifyCode.do?timestamp=" + new Date().getTime() + "&securityCode=" + data.securityCode.replace(/[\r\n]/g,"").replace(/\+/g, "%2B"));
            }
        });
    }

    /**
     * 登录函数（新版 - 挑战-响应认证）
     */
    function login() {

        if (config.demo) {
            setCookie("loginTime", new Date().getTime(), config.timeout);
            window.location.href = "index.html?timestamp=" + new Date().getTime();
            return false;
        }

        var userId = $("#userId").val();
        var password = $("#password").val();
        var nowCode = $("#nowCode").val();

        // 第一步：请求登录挑战（nonce）
        $.ajax({
            type: "POST",
            dataType: "json",
            url: config.communion + "requestLoginChallenge.do",
            data: { userId: userId },
            success: function (data) {
                if (data.errorCode != 0) {
                    $("#errorMsg").html(data.errorMsg || "获取登录挑战失败");
                    return;
                }

                var nonce = data.nonce;

                var passwordMD5 = getMD5(password);
                var responseHash = getMD5(passwordMD5 + nonce);

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: config.communion + "doLogin.do",
                    data: {
                        userId: userId,
//                        responseHash: responseHash,
                        password: passwordMD5,
                        verifyCode: nowCode,
                        company: config.company,
                        securityCode: params.securityCode,
                    },
                    success: function (data) {
                        initPage();

                        if (data.errorCode == 1) {
                            $("#newCodeIcon").attr("class", "icon-remove red");
                            $("#newCodeIcon").attr("data-content", data.errorMsg);
                            $("#errorMsg").html(data.errorMsg);
                            verifyCode();
                        } else if (data.errorCode == 0) {
                            setCookie("authentication", data.authentication.replace(/[\r\n]/g, ""), config.timeout);
                            setCookie("loginTime", new Date().getTime(), config.timeout);
                            setCookie("versionCode", config.versionCode, config.timeout);
                            if (!parent.window.isPC) {
                                document.location.href = "index.html?timestamp=" + new Date().getTime();
                            } else {
                                openChildWindow();
                            }
                        } else {
                            $("#passwordIcon").attr("class", "icon-remove red");
                            $("#passwordIcon").attr("data-content", data.errorMsg);
                            $("#errorMsg").html(data.errorMsg);
                            verifyCode();
                        }
                    },
                    error: function () {
                        $("#errorMsg").html("网络错误, 请重试");
                    }
                });
            },
            error: function () {
                $("#errorMsg").html("网络错误, 请重试");
            }
        });
    }

    /**
     * 获取MD5函数
     * 兼容多种MD5实现方式
     */
    function getMD5(str) {
        // 方式1：使用 hex_md5 函数（如果已加载 utils.js）
        if (typeof flcry !== 'undefined') {
            return flcry(str).toLocaleUpperCase();
        }
        // 方式2：使用 CryptoJS.MD5（如果已加载 crypto.min.js）
        else if (typeof CryptoJS !== 'undefined' && CryptoJS.MD5) {
            return CryptoJS.MD5(str).toString();
        }
        // 方式3：如果都不可用, 抛出错误
        else {
            alert('MD5函数不可用, 请确保加载了必要的加密库');
            throw new Error('MD5 function not available');
        }
    }

    function initPage() {
        $("#newCodeIcon").attr("class", "icon-edit");
        $("#passwordIcon").attr("class", "icon-lock");
        $("#userIdIcon").attr("class", "icon-user");

        $("#newCodeIcon").attr("data-content", "请输入验证码");
        $("#userIdIcon").attr("data-content", "请输入登陆ID");
        $("#passwordIcon").attr("data-content", "请输入密码");
    }

    function openChildWindow() {
        var url = "index-iframe.html?isPC=" + parent.window.isPC + "&isEncryption=" + parent.window.isEncryption;

        var docWindowOptions = {
            "show": true,
            "title": "方林信息平台",
            "icon": "fanglinHD.png",
            "frame": false,
            "resizable": true,
            "position": "center",
            "min_width": 1366,
            "min_height": 768,
            "show_in_taskbar": true,
        };
        require('nw.gui').Window.open(url, docWindowOptions);
        require('nw.gui').Window.get().close();
    }

    function pcBody() {
        var span = $('<img class="" src="" id="Verify" alt="看不清,换一张"/>').css({'float': 'right', 'height': '34px'});
        $('#winTop').css('display', "");
        $("div.main-container > div:first-child").remove();
        $("div.main-content").css('padding', '0xp 30px');
        $("div.main-content > div:first-child").removeClass('row');
        $("div.main-content > div:first-child > div:first-child").removeClass('col-sm-10').removeAttr('style');
        $('#login-box').css('overflow', 'hidden');
        $("#loginFrom > div:first-child").css('margin-top', '14%');
        $('div.input-icon.input-icon-right.no-padding-right').css({"padding": "0px", "margin-top": "30px", "width": "100%"});
        $('#nowCode').css({'width': '70%', 'float': 'left'});
        $('#Verify').parent().remove();
        $('#newCodeIcon').remove();
        $('#nowCode').after(span);
        $('#loginBtn').parent().removeClass('col-md-2').css({
            'margin-right': '',
            'width': '100%',
            'margin-top': '37px'
        });
        $('.btn-toolbar button').css({'float': 'left','width': '32%'});
        $('#changetoqrcode').css({'float': 'left', 'padding': '3px', 'width': '48%'});
        $('#icon').remove();
        $('#name').parent().remove();
        $('#ename').parent().remove();
        $("#unamePwdContainer > div:first-child").removeClass('clearfix').removeAttr("style");
        $("#unamePwdContainer > div:first-child > div:first-child").css({'padding': "0px", 'margin-top': '30px'});
        $('#dloginContainer').removeClass('clearfix').css({'margin': '', 'text-align': 'center'});
        $('#dloginContainer div:first-child').removeClass('login_content');
        $('.slide').css('display', 'none');
        $('body').css('display', 'block');
        $('.login-layout').css('background-color', 'white');
        $('.main-content #login-box .login_content').css({'width': '100%', 'border': '0px'});
        $('.main-content #login-box .clearfix').css('overflow', 'hidden');

        // 企微登录区域 PC 端样式调整
        $('#WWLogin .login_wwcode_text').css({
            'padding': '30px 20px',
            'text-align': 'center'
        });
        $('#wwLoginBtn').css({
            'margin': '15px 0',
            'font-size': '16px',
            'padding': '12px 30px'
        });
        $('#WWLogin .login_wwcode_refresh').css({
            'padding': '15px',
            'text-align': 'center'
        });
        
        $('#loginBtn').css({"float": "left", "width":"100%"});
        $('#FormToQR').css({"float": "left", "width":"32%", "margin":"2px 0px 2px 0px"});
        $('#FormToWX').css({"float": "left", "width":"32%", "margin":"2px 0px 0px 2px"});
        $('#FormToWW').css({"float": "left", "width":"32%", "margin":"2px 0px 0px 2px"});

    }

    document.onkeydown = function (e) {
        var _e = e || event;
        if (_e.keyCode == 13) {
            login();
            return false;
        }
    };
});