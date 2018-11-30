jQuery(function (a) {

    if (!parent.window.isPC) {
        $('body').css('display', 'block')
    }

    var count = 0;

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
    }

    config.demo && (config.server = 'result/', config.communion = 'result/', config.media = 'result/', QRCode = '/QRCode.json', queryVode = '/queryVode.json');

    verifyCode();

    $('.login_qrcode_text span').click(function () {
        !$('.login_qrcode_refresh').hasClass('hide') && ($('.login_qrcode_refresh').addClass('hide'), count = 0, initQRCode());
    });

    $('#changetoform').click(function () {
        $('#dloginContainer').addClass('hide');
        $('#unamePwdContainer').removeClass('hide');
    });

    $('#changetoqrcode').click(function () {
        $('#unamePwdContainer').addClass('hide');
        $('#dloginContainer').removeClass('hide');
    });

    $("#Verify").click(function () {
        verifyCode();
    });

    $('[data-rel=popover]').popover({container: 'body'});

    $("#registBtn").on('click', function () {
        regist();
        return false;
    });

    initPage();

    if (!parent.window.isPC) {
        backgroundShaking('container', 'canvas', '#ba2454', config.shakingColor);
    }

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
                params.securityCode = data.securityCode;
                $("#Verify").attr("src", config.communion + "/verifyCode.do?timestamp=" + new Date().getTime() + "&securityCode=" + data.securityCode);
            }
        });
    }

    function regist() {

        if (config.demo) {
            setCookie("loginTime", new Date().getTime(), config.timeout);
            window.location.href = "index.html?timestamp=" + new Date().getTime();
            return false;
        }

        $.ajax({
            type: "POST",
            dataType: "json",
            url: config.communion + "createCompany.do",
            data: {
                "company.name": $("#name").val(),
                "company.fullname": $("#fullname").val(),
                "company.corporation": $("#corporation").val(),
                "company.phone": $("#phone").val(),
                verifyCode: $("#nowCode").val(),
                securityCode: params.securityCode,
            },
            success: function (data) {
                initPage();

                if (data.errorCode == 0) {
                   $("#registInput").addClass("hide");
                   $("#registSuccess").removeClass("hide");
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

    document.onkeydown = function (e) {
        var _e = e || event;
        if (_e.keyCode == 13) {
            login();
            return false;
        }
    };
});

