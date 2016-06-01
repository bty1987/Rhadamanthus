jQuery(function(a){
    var count = 0;

    var initQRCode  = function(){
        $.ajax("QRCode.do?timestamp=" + new  Date().getTime()).done(function(data){
            $('#qrcode img').prop('src', data.QRCode);
        }).fail(function(){ alert("获取二维码失败！"); }).done(function(data){
            var _flag = data.loginInfo.loginFlag;

            _flag && checkLogin(_flag);

        });
    };

    var checkLogin = function(flag){
        count == 30 ? $('.login_qrcode_refresh').html("您的二维码已失效，<br>请点击下方刷新按钮").removeClass('hide') : $.post("queryLoginInfoByLoginFlag.do", {"loginInfo.loginFlag" : flag}).done(function(data){
            count ++ ;
            var statusCode = data.loginInfo.code;
            -1 == statusCode ? setTimeout(function(){checkLogin(flag)} , 4000)   : 0 == statusCode ? (setCookie("authentication" , data.loginInfo.authentication , 1) ,window.location.href = "index.do?timestamp=" + new Date().getTime()) : $('.login_qrcode_refresh').html(data.loginInfo.message).removeClass('hide');
        });
    };

    var setCookie =  function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    $('.login_qrcode_text span').click(function(){
        !$('.login_qrcode_refresh').hasClass('hide') && ($('.login_qrcode_refresh').addClass('hide'),count =0,initQRCode());
    });

    initQRCode();

    $('#changetoform').click(function(){
        $('#dloginContainer').addClass('hide');
        $('#unamePwdContainer').removeClass('hide');
    });

    $('#changetoqrcode').click(function(){
        $('#unamePwdContainer').addClass('hide');
        $('#dloginContainer').removeClass('hide');
    });

    var loginurl = "login.do";

    $("#Verify").click(function(){
        $(this).attr("src","verifyCode.do?timestamp="+ new Date().getTime());
    });

    $('[data-rel=popover]').popover({container:'body'});

    $("#loginBtn").on('click',login);

    initPage();

    $("#backgroundImage").fullscreenBackground();
    $("#backgroundImage").css("position", "");

});

function initPage(){
    $("#newCodeIcon").attr("class", "icon-edit");
    $("#passwordIcon").attr("class", "icon-lock");
    $("#userIdIcon").attr("class", "icon-user");

    $("#newCodeIcon").attr("data-content", "请输入验证码");
    $("#userIdIcon").attr("data-content", "请输入登陆ID");
    $("#passwordIcon").attr("data-content", "请输入密码");
}

function login() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "doLogin.do",
        data: {
            userId: $("#userId").val(),
            password: $("#password").val(),
            verifyCode: $("#nowCode").val()
        },
        success: function(data) {
            initPage();

            if(data.errorCode == 1){
                $("#newCodeIcon").attr("class", "icon-remove red");
                $("#newCodeIcon").attr("data-content", data.errorMsg);
                $("#errorMsg").html(data.errorMsg);
                $("#Verify").attr("src", "verifyCode.do?timestamp="+ new Date().getTime());
            }else if(data.errorCode == 0) {
                document.location.href = "index.do?timestamp="+ new Date().getTime();
            }else{
                $("#passwordIcon").attr("class", "icon-remove red");
                $("#passwordIcon").attr("data-content", data.errorMsg);
                $("#errorMsg").html(data.errorMsg);
                $("#Verify").attr("src","verifyCode.do?timestamp="+ new Date().getTime());
            }
        }
    });
}

function keydown(e){
    var _e = e || event;
    if(_e.keyCode == 13){
        login();
        return false;
    }
}

document.onkeydown=keydown;