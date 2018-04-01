jQuery(function(a){
	
    var count = 0;
    
    var QRCode = '/QRCode.do';
    var queryVode = '/queryVode.do';
    
    $('#icon').attr('src', config.iconImg);
    $('#name').text(config.name);
    $('#ename').text(config.ename);
    
    config.demo && (config.server = 'result/', config.communion = 'result/', config.media = 'result/', QRCode = '/QRCode.json', queryVode = '/queryVode.json');
    
    verifyCode();
    
    var initQRCode = function(){
        $.ajax(config.communion + QRCode + "?timestamp=" + new  Date().getTime() + "&prefix=" + config.prefix).done(function(data){
            $('#qrcode img').prop('src', data.QRCode);
        }).fail(function(){alert("获取二维码失败!");}).done(function(data){
        	var _flag = data.loginInfo.loginFlag;
        	
        	!config.demo && _flag && checkLogin(_flag);
        });
    };

    var checkLogin = function(flag){
        count == 30 ? $('.login_qrcode_refresh').html("您的二维码已失效, <br>请点击下方刷新按钮").removeClass('hide') : $.post(config.communion + "/queryLoginInfoByLoginFlag.do", {"loginInfo.loginFlag" : flag}).done(function(data){
            count ++ ;
            var statusCode = data.loginInfo.code;
            
            if(statusCode == -1){
            	setTimeout(function(){checkLogin(flag)} , 4000)
            }else if(0 == statusCode){
            	setCookie("authentication" , data.loginInfo.authentication , config.timeout);
            	setCookie("loginTime" , new Date().getTime() , config.timeout);
            	
            	window.location.href = "index.html?timestamp=" + new Date().getTime();
            }else{
            	$('.login_qrcode_refresh').html(data.loginInfo.message).removeClass('hide')
            }
        });
    };

    var setCookie =  function(cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes*60*1000));
        var expires = "expires=" + d.toUTCString();
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
    	verifyCode();
    });

    $('[data-rel=popover]').popover({container:'body'});

    $("#loginBtn").on('click', function(){
    	login();
    	return false;
    });
    
    initPage();
    
    backgroundShaking('container', 'canvas', '#ba2454', config.shakingColor);

    //$("#backgroundImage > img").attr('src', config.backgroundImg);
    //$("#backgroundImage").fullscreenBackground();
    //$("#backgroundImage").css("position", "");
    
    function verifyCode(){
    	
    	if(config.demo){
    		$("#Verify").attr("src", 'images/verifyCode.jpg');
    		return false;
    	}
    	
    	$.ajax({
    		url: config.server + queryVode,
    		type: "POST",
            dataType: "json",
            success: function(data){
        		params.securityCode = data.securityCode;
            	$("#Verify").attr("src", config.server + "/verifyCode.do?timestamp="+ new Date().getTime() + "&securityCode=" + data.securityCode);
            }
    	});
    }

    function login(){
    	
    	if(config.demo){
    		setCookie("loginTime" , new Date().getTime() , config.timeout);
    		window.location.href = "index.html?timestamp=" + new Date().getTime();
    		return false;
    	}
    	
    	$.ajax({
            type: "POST",
            dataType: "json",
            url: config.server + "doLogin.do",
            data: {
                userId: $("#userId").val(),
                password: $("#password").val(),
                verifyCode: $("#nowCode").val(),
                company: config.company,
                securityCode: params.securityCode,
            },
            success: function(data) {
                initPage();

                if(data.errorCode == 1){
                    $("#newCodeIcon").attr("class", "icon-remove red");
                    $("#newCodeIcon").attr("data-content", data.errorMsg);
                    $("#errorMsg").html(data.errorMsg);
                    verifyCode();
                }else if(data.errorCode == 0) {
                	setCookie("authentication" , data.authentication , config.timeout);
                	setCookie("loginTime" , new Date().getTime() , config.timeout);
                	setCookie("versionCode", config.versionCode, config.timeout);
                    document.location.href = "index.html?timestamp="+ new Date().getTime();
                }else{
                    $("#passwordIcon").attr("class", "icon-remove red");
                    $("#passwordIcon").attr("data-content", data.errorMsg);
                    $("#errorMsg").html(data.errorMsg);
                    verifyCode();
                }
            }
        });
    }

    function initPage(){
        $("#newCodeIcon").attr("class", "icon-edit");
        $("#passwordIcon").attr("class", "icon-lock");
        $("#userIdIcon").attr("class", "icon-user");

        $("#newCodeIcon").attr("data-content", "请输入验证码");
        $("#userIdIcon").attr("data-content", "请输入登陆ID");
        $("#passwordIcon").attr("data-content", "请输入密码");
    }

    document.onkeydown = function(e){
    	var _e = e || event;
        if(_e.keyCode == 13){
            login();
            return false;
        }
    };
});

