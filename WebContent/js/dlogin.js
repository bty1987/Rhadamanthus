jQuery(function(a){

    if(!parent.window.isPC){
        $('body').css('display','block')
    }
	
    var count = 0;
    
    var QRCode = '/QRCode.do';
    var queryVode = '/queryVode.do';
    var params = {};
    
    $('#icon').attr('src', config.iconImg);
    $('#name').text(config.name);
    $('#ename').text(config.ename);

    var setCookie =  function(cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes*60*1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    
    if(!config.intranet){
    	$.ajax({
            url: 'http://114.215.183.148/communion.do',
            data:{},
            type: "post",
            dataType: "json",
            async:false,
            success: function(res){
                config.communion = res.communion
                setCookie('communion', res.communion, config.timeout)
            }
        });
	}
    
    if(parent.window.isPC){

        pcBody();

        var os = require('os');
        var networkInterfaces = os.networkInterfaces();

        var mac = "";

        var interfaces = networkInterfaces["本地连接"];

        for(var i in interfaces){

            var _if = interfaces[i];

            if(_if.family.toLowerCase() == "ipv4"){
                mac = _if.mac.replace(/:/g, '').replace(/-/g, '').toLowerCase();
            }
        }

        if(mac == ""){
            alert("设备无使用权限,如果有问题请联系管理员.");
            require('nw.gui').Window.get().close();
        }

        $.ajax({
            url: config.communion + "checkMacontrol.do",
            type: "POST",
            dataType: "json",
            async:false,
            data:{"macontrol.mac": mac},
            success: function(res){
                if(res.errorCode != 0){
                    alert("设备无使用权限,如果有问题请联系管理员.");
                    require('nw.gui').Window.get().close();
                }
            },
            error: function(res){
                alert("设备无使用权限,如果有问题请联系管理员.");
                require('nw.gui').Window.get().close();
            }
        });

    }

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
            	if(!parent.window.isPC){
                    window.location.href = "index.html?timestamp=" + new Date().getTime();
                }else{
                    openChildWindow();
                }

            }else{
            	$('.login_qrcode_refresh').html(data.loginInfo.message).removeClass('hide')
            }
        });
    };

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

    $("#Verify").click(function(){
    	verifyCode();
    });

    $('[data-rel=popover]').popover({container:'body'});

    $("#loginBtn").on('click', function(){
    	login();
    	return false;
    });
    
    initPage();

    if(!parent.window.isPC){
        backgroundShaking('container', 'canvas', '#ba2454', config.shakingColor);
    }


    //$("#backgroundImage > img").attr('src', config.backgroundImg);
    //$("#backgroundImage").fullscreenBackground();
    //$("#backgroundImage").css("position", "");
    
    function verifyCode(){
    	
    	if(config.demo){
    		$("#Verify").attr("src", 'images/verifyCode.jpg');
    		return false;
    	}
    	
    	$.ajax({
    		url: config.communion + queryVode,
    		type: "POST",
            dataType: "json",
            success: function(data){
        		params.securityCode = data.securityCode;
            	$("#Verify").attr("src", config.communion + "/verifyCode.do?timestamp="+ new Date().getTime() + "&securityCode=" + data.securityCode);
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
            url: config.communion + "doLogin.do",
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
                	if(!parent.window.isPC){
                        document.location.href = "index.html?timestamp="+ new Date().getTime();
                    }else{
                        openChildWindow();
                    }

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

    function openChildWindow() {
        var url = "index-iframe.html?isPC="+parent.window.isPC+"&isEncryption="+parent.window.isEncryption;

        var docWindowOptions = {
            "show":true,
            "title": "方林信息平台",
            "icon": "fanglinHD.png",
            "frame": false,
            "fullscreen":true,
            "resizable":true,
            "position": "center",
            "max_width": 0,
            "max_height": 0,
            "show_in_taskbar":true,
        };
        require('nw.gui').Window.open(url,docWindowOptions);
        require('nw.gui').Window.get().close();
    }

    function pcBody(){
        var span = $('<img class="" src="" id="Verify" alt="看不清,换一张"/>').css({'float':'right','height':'34px'});
        $('#winTop').css('display',"")
        $("div.main-container > div:first-child").remove();
        $("div.main-content").css('padding','0xp 30px');
        $("div.main-content > div:first-child").removeClass('row')
        $("div.main-content > div:first-child > div:first-child").removeClass('col-sm-10').removeAttr('style');
        $('#login-box').css('overflow','hidden');
        $("#loginFrom > div:first-child").css('margin-top','14%');
        $('div.input-icon.input-icon-right.no-padding-right').css({"padding":"0px","margin-top":"30px"});
        $('#nowCode').css({'width':'65%','float':'left'});
        $('#Verify').parent().remove();
        $('#newCodeIcon').remove();
        $('#nowCode').after(span)
        $('#loginBtn').parent().removeClass('col-md-2').css({'margin-right':'','width':'100%','margin-top':'37px'});
        $('#loginBtn').css({'float':'left','padding':'3px','width':'48%','margin-right':'4.5px'});
        $('#changetoqrcode').css({'float':'left','padding':'3px','width':'48%'});
        $('#icon').remove();
        $('#name').parent().remove();
        $('#ename').parent().remove();
        $("#unamePwdContainer > div:first-child").removeClass('clearfix').removeAttr("style");
        $("#unamePwdContainer > div:first-child > div:first-child").css({'padding':'0px','margin-top':'30px'})
        $('#dloginContainer').removeClass('clearfix').css({'margin':'','text-align':'center'})
        $('#dloginContainer div:first-child').removeClass('login_content')
        $('.slide').css('display','none')
        $('body').css('display','block')
    }

    document.onkeydown = function(e){
    	var _e = e || event;
        if(_e.keyCode == 13){
            login();
            return false;
        }
    };
});

