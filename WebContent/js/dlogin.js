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
    
    if(config.oss){
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
    $('#FormToQR').click(function () {
        $('#unamePwdContainer').addClass('hide');
        $('#QRLogin').removeClass('hide');
    });
    $('#FormToWX').click(function () {
        $('#unamePwdContainer').addClass('hide');
        $('#WXLogin').removeClass('hide');
    });
    $('#QRToWX').click(function () {
        $('#QRLogin').addClass('hide');
        $('#WXLogin').removeClass('hide');
    });
    $('#WXToQR').click(function () {
        $('#WXLogin').addClass('hide');
        $('#QRLogin').removeClass('hide');
    });

    $("#Verify").click(function () {
        verifyCode();
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
        var verifyCode = $("#nowCode").val();

        // 第一步：请求登录挑战（nonce）
        $.ajax({
            type: "POST",
            dataType: "json",
            url: config.communion + "requestLoginChallenge.do",
            data: { userId: userId },
            xhrFields: {
                withCredentials: true  // 跨域请求携带 cookie（保持 session 一致）
            },
            crossDomain: true,
            success: function (data) {
                if (data.errorCode != 0) {
                    $("#errorMsg").html(data.errorMsg || "获取登录挑战失败");
                    return;
                }

                var nonce = data.nonce;

                // 第二步：计算响应哈希
                // 客户端：MD5(MD5(password) + nonce)
                var passwordMD5 = getMD5(password);  // 第一次MD5
                var responseHash = getMD5(passwordMD5 + nonce);  // 第二次MD5

                // 第三步：发送响应哈希进行登录
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: config.communion + "doLogin.do",
                    data: {
                        userId: userId,
                        responseHash: responseHash,  // 使用响应哈希而非明文密码
                        verifyCode: verifyCode,
                        company: config.company,
                        securityCode: params.securityCode,
                    },
                    xhrFields: {
                        withCredentials: true  // 跨域请求携带 cookie（保持 session 一致）
                    },
                    crossDomain: true,
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
                        $("#errorMsg").html("网络错误，请重试");
                    }
                });
            },
            error: function () {
                $("#errorMsg").html("网络错误，请重试");
            }
        });
    }

    /**
     * 获取MD5函数
     * 兼容多种MD5实现方式
     */
    function getMD5(str) {
        // 方式1：使用 hex_md5 函数（如果已加载 utils.js）
        if (typeof hex_md5 !== 'undefined') {
            return hex_md5(str);
        }
        // 方式2：使用 CryptoJS.MD5（如果已加载 crypto.min.js）
        else if (typeof CryptoJS !== 'undefined' && CryptoJS.MD5) {
            return CryptoJS.MD5(str).toString();
        }
        // 方式3：如果都不可用，抛出错误
        else {
            alert('MD5函数不可用，请确保加载了必要的加密库');
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
        $("#unamePwdContainer > div:first-child > div:first-child").css({'padding': '0px', 'margin-top': '30px'});
        $('#dloginContainer').removeClass('clearfix').css({'margin': '', 'text-align': 'center'});
        $('#dloginContainer div:first-child').removeClass('login_content');
        $('.slide').css('display', 'none');
        $('body').css('display', 'block');
        $('.login-layout').css('background-color', 'white');
        $('.main-content #login-box .login_content').css({'width': '100%', 'border': '0px'});
        $('.main-content #login-box .clearfix').css('overflow', 'hidden');

    }

    document.onkeydown = function (e) {
        var _e = e || event;
        if (_e.keyCode == 13) {
            login();
            return false;
        }
    };
});