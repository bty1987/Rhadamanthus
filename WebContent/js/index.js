
$(function(){

    Api().init('js/api/');
    Condition = Condition(api);

    params.authentication = window.authentication;
    params.loginTime = window.loginTime;

    if(!config.intranet) config.communion = window.communion;

    com.post(api.personel.queryUserForSelfByUserId, {}, function(res){
        
        params.userInfo = res.userInfo;
        
        if(!config.intranet){
	        com.post(api.system.queryServer, {"user.userId":res.userInfo.user.userId},function(res){
	            $.each(res.servers,function(i,v){
	                config[v.name] = v.host;
	            });
	        }, null, false);
    	}

        com._post_(api.home.library, {
            "userId":params.userInfo.user.userId,
            "loginTime":window.loginTime,
            "mc":"",
			"api": "system.login.login"
        });
        
        setInterval(function(){
            com._post_(api.home.library,{
                "userId":params.userInfo.user.userId,
                "mc":"",
                "api": "system.login.index",
                "loginTime": window.loginTime
            }, function(res){
                if(res.code != 0){
                    alert('账号在其他设备上登录!');
                    
                    window.onbeforeunload=null;
                    setCookie("authentication", "", -1);
                    
                    if(parent.window.isPC){
                        nwRestart();
                    }else{
                        window.location.href = '/';
                    }
                }
            })
        }, config.singlePointTime);

        $(".user-info-dropmenu .user-name").text(res.userInfo.user.currentName);
        $(".user-info-dropmenu #userId").text(res.userInfo.user.currentName);
        $(".user-name").text(res.userInfo.user.currentName);

        $("#userInfoId").text(res.userInfo.user.currentName);
        $("#userLeftId").text(res.userInfo.user.currentName);

        window.userLockName = res.userInfo.user.currentName;
        window.userLockPhoto = res.userInfo.user.userPhoto;

        com.showImg($("#userImg"), res.userInfo.user.userPhoto, 30, 30, '');
        com.showImg($("#userImgleft"), res.userInfo.user.userPhoto, 30, 30, '');
        com.showImg($("#userImgtop"), res.userInfo.user.userPhoto, 60, 60, '');

        com.post(api.system.queryCompanyByCid,{"company.cid": res.userInfo.user.companys},function(data){

            params.company = data.company;

            $(".companyinfo .companyName").text(data.company.name);

        }, null, false);

    }, null, false);

    com.post(api.system.queryModuleForLogin, {"module.system": 1}, createMenu);

    if(parent.window.isPC){ $("#logout").remove(); $(".divider").remove(); }

    $("#versionCode").text(config.versionCode);

    $(".userProfile").attr("href", api.index.userProfile.url + "?timestamp="+ new Date().getTime());
    $(".userProfile").data("level", 1);

    $(".changePassword").attr("href", api.index.changePasswordIndex.url + "?timestamp=" + new Date().getTime());
    $(".changePassword").data("level", 1);

    $(".messageList").attr("href", api.index.messageIndex.url + "?timestamp=" + new Date().getTime());
    $(".messageList").data("level", 1);

    //clear 左侧图标
    $("#switchUserp").attr("href", api.index.userProfile.url + "?timestamp="+ new Date().getTime());
    $("#switchUserp").data("level", 1);

    $("#switchChangepwd").attr("href", api.index.changePasswordIndex.url + "?timestamp=" + new Date().getTime());
    $("#switchChangepwd").data("level", 1);

    $("#switchMessagem").attr("href", api.index.messageIndex.url + "?timestamp=" + new Date().getTime());
    $("#switchMessagem").data("level", 1);

    var setCookie =  function(cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes*60*1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    params.userCompany = window.userCompany;

    com.post(api.personel.queryUserCompany, {"user.uid": params.userInfo.user.uid}, function (res) {

        var companysel = $('#companysel').html("");

        $.each(res.userCompanys, function(i,v){
            var $li = $('<li></li>').appendTo(companysel);
            var $a = $('<a></a>').attr('data-cid',v.company.cid).text(v.company.name).appendTo($li);
            $a.click(function(e){
                params.selectCaching = {};

                com.post(api.common.changeAuthCode,{"company": v.company.cid },function(res){

                    for(var key in params){
                        if(key.indexOf("PostData")!=-1){
                            params[key] = null;
                        }
                    }
                    params.authentication = res.authentication;
                    window.authentication = res.authentication;

                    com.switchPage(api.index.homeIndex.url);

                    // 切换公司后 目录所有菜单收起
                    foldMenu();

                    companysel.parent().removeClass("open");

                    com.post(api.system.queryCompanyByCid,{"company.cid": v.company.cid},function(res){
                        params.company = res.company;
                        $(".companyinfo .companyName").text(res.company.name)
                    }, null, false);

                }, null, false);

                return false;
            });
        });
    }, null, false);

    $("#logout").on("click", function(e){
        setCookie("authentication", "", -1);
        window.location.href = '/';
    });

    $(".userProfile").on("click", function(e){
        foldMenu();

        $this = $(this);
        navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
            com.switchPage(hrefStr);
        }
    });

    $(".changePassword").on("click", function(e){
        foldMenu();

        $this = $(this);
        navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
            com.switchPage(hrefStr);
        }
    });

    $("#indexBtn").on("click", function(e){
        foldMenu();
        com.switchPage('home.html');
        return false;
    });

    $(".messageList").on("click", function(e){
        foldMenu();
        $this = $(this);
        navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
            com.switchPage(hrefStr);
        }
        $('.breadcrumb .nav1').empty().append('<i class="icon-envelope"></i>&nbsp;消息查看');
    });

    $("#versionInfo").on("click", function(e){
        foldMenu();
        $('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;版本');
        com.switchPage(api.index.versionIndex.url);
        $('.breadcrumb .nav2').hide();
        $('.breadcrumb .nav3').hide();
    });

    $("#faqInfo").on("click", function(e){
        foldMenu();
        $('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;帮助');
        com.switchPage(api.index.faqIndex.url);
        $('.breadcrumb .nav2').hide();
        $('.breadcrumb .nav3').hide();
    });
    $("#called").unbind().bind('click',function(){
        var sameFalg=true;
        $("#phonecallModal").modal("show");
        $("#username").val(params.userInfo.user.currentName);
        $("#caller").val(params.userInfo.user.phone);
        $("#callee").val("");

        $("#callee").on("blur",function(){
            $this = $(this);
            if($("#caller").val() != $this.val()){
                sameFalg=true;
            }else{
                bootbox.alert("主叫号码与被叫号码一致");
                sameFalg=false;
            }
        });

        $("#save").unbind().bind('click',function(){

            if(com.validate()||!sameFalg){
                return;
            }
            var param = {
                "phoneCall.operater.userId":params.userInfo.user.userId,
                "phoneCall.caller":params.userInfo.user.phone,
                "phoneCall.callee":$("#callee").val(),
            };

            com.post(api.information.phoneCall, param, function(res){
                com.showAlert(com.info, "电话拨叫中.....");
            });
            $('#phonecallModal').modal("hide");

        })

    });

    // clear append
    $("#switchUserp").on("click", function(e){
        foldMenu();

        $this = $(this);
        navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
            com.switchPage(hrefStr);
        }
        $('.breadcrumb .nav1').empty().append('<i class="fa fa-fw ti-user"></i>&nbsp;个人资料');
    });
    $("#switchChangepwd").on("click", function(e){
        foldMenu();

        $this = $(this);
        navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
            com.switchPage(hrefStr);
        }
        $('.breadcrumb .nav1').empty().append('<i class="fa fa-fw ti-settings"></i>&nbsp;修改密码');
    });
    $("#switchMessagem").on("click", function(e){
        foldMenu();

        $this = $(this);
        navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
            com.switchPage(hrefStr);
        }
        $('.breadcrumb .nav1').empty().append('<i class="fa fa-fw ti-comments"></i>&nbsp;消息查看');
    });

    $("#userLock").on("click",function(i){
        doLocking();
    });

//	setInterval(function(){
//		loadMessageCount();
//	}, 1800000);

    params.homeLoader = false;

    Pace.on('hide', function(){
        if(config && !params.homeLoader){
            $('#navbar').fadeIn();
            $('#main-container').fadeIn();
            com.switchPage('home.html');
            params.homeLoader = true;
        }
    });

    function createMenu(data){

        var menuArr = {
            level1 : [],
            level2 : [],
            level3 : []
        };

        var menuObj = {
            level1 : {},
            level2 : {}
        };
        var treeData = data.modules;
        var $tree = $("ul.nav-list");
        var $main = $('<li class="active"><a href="#"><i class="icon-home"></i><span class="menu-text">首页</span><b class="selected"></b></a></li>').appendTo($tree);
        var arr;

        $tree.slimscroll({
            height: '100vh',
            size: '5px',
            opacity: 0.2
        });

        $main.click(function(){
            $('li',$tree).removeClass('open').removeClass('active');
            $main.addClass('active');
            com.switchPage('home.html');
            return false;
        });

        if(!treeData || !treeData.length){
            return;
        }

        $.each(treeData , function(i, v){
            arr = menuArr['level' + v.level];
            arr[arr.length] = v;
        });

        $.each(menuArr, function(key, val){
            menuArr[key] = val.sort(function(a,b){
                return a.order-b.order
            });
        });

        if(menuArr.level1.length){
            $.each(menuArr.level1, function(i, v){
                var $li = $('<li></li>');
                var $a = $('<a href="#"></a>');
                var $i = $('<i></i>').addClass(v.icon);
                var $span = $('<span></span>').addClass('menu-text').text(v.name);
                $a.append($i).append($span).appendTo($li);
                menuObj.level1[v.mid] = $li;
                $li.appendTo($tree);
            });
        }

        if(menuArr.level2.length){
            $.each(menuArr.level2, function(i, v){
                var $li = $('<li></li>');
                var $a = $('<a></a>').attr('href', v.url ? v.url : '#');
                var $i = $('<i></i>').addClass(v.icon);
                var $span = $('<span></span>').addClass('menu-text').text(v.name);
                $a.append($i).append($span).appendTo($li);
                menuObj.level2[v.mid] = $li;

                var $parent = menuObj.level1[v.fatherModule.mid];
                $parent.children('a').children('b').length || $('<b></b>').addClass('arrow icon-angle-down').appendTo($parent.children('a'));
                var $pul = $parent.children('ul').length ? $parent.children('ul') : $('<ul></ul>').addClass('submenu').appendTo($parent);
                $li.appendTo($pul);
            });
        }

        if(menuArr.level3.length){
            $.each(menuArr.level3, function(i, v){
                var $li = $('<li></li>');
                var $a = $('<a></a>').attr('href', v.url ? v.url : '#');
                var $i = $('<i></i>').addClass(v.icon);
                var $span = $('<span></span>').addClass('menu-text').text(v.name);
                $a.append($i).append($span).appendTo($li);

                var $parent = menuObj.level2[v.fatherModule.mid];
                $parent.children('a').children('b').length || $('<b></b>').addClass('arrow icon-angle-down').appendTo($parent.children('a'));
                var $pul = $parent.children('ul').length ? $parent.children('ul') : $('<ul></ul>').addClass('submenu').appendTo($parent);
                $li.appendTo($pul);
            });
        }

        $("a", $tree).on("click", function(e){
            $this = $(this);
//			navControl($this);

            var hrefStr = $this.attr("href");

            if($this.siblings('ul').length){
                if(!$this.parent('li').hasClass('active')){
                    $this.parent('li').toggleClass('open');
                    $this.parent('li').siblings('li').not('.active').removeClass('open');
                }
            }else{
                if(hrefStr != "#" && hrefStr!="null" && hrefStr != undefined){
                    // 截取load参数存至全局变量
                    params['urlLoadParams'] = com.splitUrl(hrefStr);

                    com.switchPage(hrefStr);
                    $('.active').not($this.parents('li')).removeClass('active').removeClass('open');
                    $this.parent('li').addClass('active');
                    //$this.parents('.nav-list > li').addClass('active');
                    $this.next("ul").toggle().closest("li").siblings("li").children("ul").hide();
                }
            }

            e.preventDefault();
        });
    }

    function navControl($this){
        if($this.data('level') == 1){
            $('.level1').removeClass('level1');
            $this.addClass('level1');
            if($this.attr('href')!='#'){
                $('ul.breadcrumb .nav1').html("<i class='"+$('i', $this).attr('class')+"'></i> "+$this.text());
                $('ul.breadcrumb .nav2').hide();
                $('ul.breadcrumb .nav3').hide();
            }
        }else if($this.data('level') == 2){
            $('.level2').removeClass('level2');
            $this.addClass('level2');
            if($this.attr('href')!='#'){
                $('ul.breadcrumb .nav1').html("<i class='"+$('.nav-list .level1 i').attr('class')+"'></i> "+$('.nav-list .level1').text());
                $a = $('<a href='+$this.attr("href")+'>'+$this.text()+'</a>');
                $('ul.breadcrumb .nav2').show().html($a);
                $('ul.breadcrumb .nav3').hide();
                $a.on('click', function(e){
                    e.preventDefault();
                    com.switchPage(e.target.href);
                });
            }
        }else if($this.data('level') == 3){
            $('.level3').removeClass('level3');
            $this.addClass('level3');
            if($this.attr('href')!='#'){
                $('ul.breadcrumb .nav1').html("<i class='"+$('.nav-list .level1 i').attr('class')+"'></i> "+$('.nav-list .level1').text());
                $('ul.breadcrumb .nav2').show().text($('.nav-list .level2').text());
                $a = $('<a href='+$this.attr("href")+'>'+$this.text()+'</a>');
                $('ul.breadcrumb .nav3').show().html($a);
                $a.on('click', function(e){
                    e.preventDefault();
                    com.switchPage(e.target.href);
                });
            }
        }
    }

    function doLocking(){

        $("#userNameLock").text(window.userLockName);

        com.showImg($("#personalPicLock"), window.userLockPhoto, 180, 180, '');

        $("#lockPassword").val('');

        $("#outLockingContent").bringins({"position":"center", "color":"#a7a7a7","closeButton":"white","width":"100%"});

        //不能正常请求
        window.notOperate = true;

        // 禁止右键刷新
        document.oncontextmenu = function(){ return false };
        // 禁止F5刷新
        document.onkeydown = function (e) {
            var ev = window.event || e;
            var code = ev.keyCode || ev.which;
            if (code == 116) {
                ev.keyCode ? ev.keyCode = 0 : ev.which = 0;
                cancelBubble = true;
                return false;
            }
            // 按下回车键锁屏登录
            if (code == 13){
                lockSubmit();
                return false;
            }
        };

        $("#lockSubmit").on("click",function(){  lockSubmit();  });

    }

    function clearLocking(){
        $("[id*='bringins-block-close-']").click();
        window.notOperate = false; // 可以正常请求
        document.oncontextmenu = function () {  return true; };
        document.onkeydown =  function (e) {
            var ev = window.event || e;
            var code = ev.keyCode || ev.which;
            if (code == 116) {
                isF5 = true;
            }
        };
    }

    // 锁屏登录
    var errorLockCount = 0;
    function lockSubmit(){

        $.ajax({
            type: "POST",
            dataType: "json",
            url: config.communion + api.common.updateAuthCode.url,
            data: {
                "authentication" : params.authentication,
                "user.password": $("#lockPassword").val()
            },
            success: function(res) {

                if(res.errorCode == 0){
                    // 重置cookie
                    setCookie("authentication" , res.authentication , config.timeout);
                    setCookie("loginTime" , new Date().getTime() , config.timeout);
                    setCookie("versionCode", config.versionCode, config.timeout);
                    // 重置params
                    params.authentication = res.authentication;
                    params.loginTime = new Date().getTime();
                    // 重置window
                    window.authentication = params.authentication;
                    window.loginTime = params.loginTime;
                    window.versionCode = config.versionCode;

                    clearLocking();

                    $(".block.input-icon.input-icon-right").find('i.red.icon-remove-sign').remove();
                    $(".block.input-icon.input-icon-right").find('span.red.errorText').remove();

                    errorLockCount = 0;

                }else{

                    $(".block.input-icon.input-icon-right").find('i.red.icon-remove-sign').remove();
                    $(".block.input-icon.input-icon-right").find('span.red.errorText').remove();

                    $("#lockPassword").parent().append("<i class='red icon-remove-sign'></i><span class='red errorText'>密码错误</span>");
                    errorLockCount ++;

                    if (errorLockCount == 2) {

                        if (parent.window.isPC) {
                            $(".block").parent().empty();
                            $('#lockSubmit').remove();
                            var $container = $("<div style='font-family: 幼圆;font-size: 20px;'></div>");
                            var $promptText = $("<i class='red icon-remove-sign' style='margin-right: 10px;position: relative!important;'></i><span class='red' style='margin-right: 6px;'>密码错误，请</span>");
                            var $lockSubmit = $("<span class='green'>重新登录</span>");

                            $("#outLockingContent .login-form-sub .form-group").append($container.append($promptText).append($lockSubmit));
                        } else {

                            $("#lockPassword").addClass('lock-error-input').attr({'readonly': 'readonly'});
                            $("#lockSubmit").text("去登录");

                            errorLockCount = 0;

                            $("#lockSubmit").on("click", function (e) {
                                isF5 = true;
                                window.location.href = "/";
                            });

                            document.onkeydown = function(e){
                                var _e = e || event;
                                if(_e.keyCode == 13){
                                    $("#lockSubmit").click();
                                    return false;
                                }
                            };
                        }
                    }
                }
            }
        });
    }

    // 收起全部菜单
    function foldMenu(){
        $('li','ul.nav-list').removeClass('open').removeClass('active');
        $('ul.nav-list li').first().addClass('active');
    }
	//生成二维码
	$('#qrcode').qrcode({
		render: "canvas", //也可以替换为table
		width: 100,
		height: 100,
		text: "fanglinserver:"+params.userInfo.user.userId,
    });

});
