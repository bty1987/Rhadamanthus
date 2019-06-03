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
    
    var qrcodeType = 0;
    var qrcodeMask = $(".qrcode_mask");
    var qrtype = $(".qrtype");

    var setCookie = function (cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    if (!config.intranet) {
        $.ajax({
            url: 'http://114.215.183.148/communion.do',
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

        var os = require('os');
        var networkInterfaces = os.networkInterfaces();
        var macs = {}
        var _index = 0
        $.each(networkInterfaces, function (index, value) {

            for (var i in value) {

                var _if = value[i];

                if (_if.family.toLowerCase() == "ipv4") {
                    var mac = _if.mac.replace(/:/g, '').replace(/-/g, '').toLowerCase();
                    macs['macs[' + _index + ']'] = mac;
                }
            }
            _index++;
        })

        if (macs.length == 0) {
            alert("设备信息获取失败,如果有问题请联系管理员.");
            require('nw.gui').Window.get().close();
        }

        $.ajax({
            url: config.communion + "checkMacontrol.do",
            type: "POST",
            dataType: "json",
            async: false,
            data: macs,
            success: function (res) {
                if (res.errorCode != 0) {
                    alert("设备无使用权限,如果有问题请联系管理员.");
                    require('nw.gui').Window.get().close();
                }
            },
            error: function (res) {
                alert("设备权限验证失败,如果有问题请联系管理员.");
                require('nw.gui').Window.get().close();
            }
        });
    } else if (!location.hostname.startsWith('192.168')){
//        $("#unamePwdContainer").remove();
//        $("#QRLogin").remove();
//        $("#WXLogin").remove();
    }

    config.demo && (config.server = 'result/', config.communion = 'result/', config.media = 'result/', QRCode = '/QRCode.json', queryVode = '/queryVode.json');

    verifyCode();

    var initQRCode = function (type) {
        
        qrcodeMask.addClass('hide');
        count = 0;
        qrcodeType = type;
        
        qrtype.html(type == 0 ? "钉钉" : "微信");
        
        $.ajax(config.communion + QRCode + "?timestamp=" + new Date().getTime() + "&prefix=" + config.prefix + "&type=" + type).done(function (data) {
            $('#qrcode').prop('src', data.QRCode).removeClass("hide");
        }).fail(function () {
            alert("获取二维码失败!");
        }).done(function (data) {
            var _flag = data.loginInfo.loginFlag;
            !config.demo && _flag && checkQRLogin(_flag);
        });
    };

    var checkQRLogin = function (flag) {
        count == 20 ? qrcodeMask.removeClass('hide') : $.post(config.communion + "/queryLoginInfoByLoginFlag.do", {"loginInfo.loginFlag": flag}).done(function (data) {
            count++;
            var statusCode = data.loginInfo.code;

            if (statusCode == -1) {
                setTimeout(function () {
                    checkQRLogin(flag)
                }, 4000)
            } else if (0 == statusCode) {
                setCookie("authentication", data.loginInfo.authentication, config.timeout);
                setCookie("loginTime", new Date().getTime(), config.timeout);
                if (!parent.window.isPC) {
                    window.location.href = "index-dark.html?timestamp=" + new Date().getTime();
                } else {
                    openChildWindow();
                }
            } else {
                qrcodeMask.html(data.loginInfo.message).removeClass('hide')
            }
        });
    };

    initQRCode(0);
    
    $('#wechatQR').click(function () {
        (!qrcodeMask.hasClass('hide') || qrcodeType != 1) && initQRCode(1);
    });
    
    $('#dingtalkQR').click(function () {
        (!qrcodeMask.hasClass('hide') || qrcodeType != 0) && initQRCode(0);
    });

    $("#verify").click(function () {
        verifyCode();
    });

    $("#loginBtn").on('click', function () {
        login();
        return false;
    });

    initPage();

    //$("#backgroundImage > img").attr('src', config.backgroundImg);
    //$("#backgroundImage").fullscreenBackground();
    //$("#backgroundImage").css("position", "");

    function verifyCode() {

        if (config.demo) {
            $("#verify").attr("src", 'images/verifyCode.jpg');
            return false;
        }

        $.ajax({
            url: config.communion + queryVode,
            type: "POST",
            dataType: "json",
            success: function (data) {
                params.securityCode = data.securityCode.replace(/[\r\n]/g,"");
                $("#verify").removeClass("hide").attr("src", config.communion + "/verifyCode.do?timestamp=" + new Date().getTime() + "&securityCode=" + data.securityCode.replace(/[\r\n]/g,"").replace(/\+/g, "%2B"));
            }
        });
    }

    function login() {

        if (config.demo) {
            setCookie("loginTime", new Date().getTime(), config.timeout);
            window.location.href = "index.html?timestamp=" + new Date().getTime();
            return false;
        }

        $.ajax({
            type: "POST",
            dataType: "json",
            url: config.communion + "doLogin.do",
            data: {
                userId: $("#userId").val(),
                password: $("#password").val(),
                verifyCode: $("#nowCode").val(),
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
                    setCookie("authentication", data.authentication.replace(/[\r\n]/g,""), config.timeout);
                    setCookie("loginTime", new Date().getTime(), config.timeout);
                    setCookie("versionCode", config.versionCode, config.timeout);
                    if (!parent.window.isPC) {
                        document.location.href = "index-dark.html?timestamp=" + new Date().getTime();
                    } else {
                        openChildWindow();
                    }
                } else {
                    $("#passwordIcon").attr("class", "icon-remove red");
                    $("#passwordIcon").attr("data-content", data.errorMsg);
                    $("#errorMsg").html(data.errorMsg);
                    verifyCode();
                }
            }
        });
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

