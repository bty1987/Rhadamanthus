$(function(){

    $('#login').click(function(){
        Ding.handle(23525686, window.location.href, function(cfg, user){
            var params = utils.getUrlParams();
            $.ajax({
                type: 'GET',
                url: config.serverHost + "updateLoginInfoForAuthentication.do",
                data: {"loginInfo.loginFlag" : params.loginFlag ,"loginInfo.authentication" :  cfg.authenticationEncode},
                async: false,
                success: function(res){
                    $('#login').hide();
                    $.toast("登陆成功", 1000);
                },
                error: function (xhr, errorType, error) {
                    $.alert("错误" + error + errorType);
                }
            });
        });
    });
});