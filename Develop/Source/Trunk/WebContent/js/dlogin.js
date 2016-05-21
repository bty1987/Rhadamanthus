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
        count == 20 ? $('.login_qrcode_refresh').html("您的二维码已失效，<br>请点击下方刷新按钮").removeClass('hide') : $.post("queryLoginInfoByLoginFlag.do", {"loginInfo.loginFlag" : flag}).done(function(data){
            count ++ ;
            var statusCode = data.loginInfo.code;
            -1 == statusCode ? setTimeout(function(){checkLogin(flag)} , 2000)   : 0 == statusCode ? (setCookie("authentication" , data.loginInfo.authentication , 1) ,window.location.href = "main.html") : $('.login_qrcode_refresh').html(data.loginInfo.message).removeClass('hide');
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
});