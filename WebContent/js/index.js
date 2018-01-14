
$(function(){
    
    Api().init('js/api/');
    Condition = Condition(api);
    
	params.authentication = window.authentication;
	params.loginTime = window.loginTime;
    
	com.post(api.system.queryModuleForLogin, {"module.system": 1}, createMenu);
	
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
    }
	
	var companysel = null;

    params.loginTime = window.loginTime;
    params.userCompany = window.userCompany;

    com.post(api.personel.queryUserForSelfByUserId, {}, function(res){

        params.userInfo = res.userInfo;

        $(".user-info-dropmenu .user-name").text(res.userInfo.user.currentName);
        $(".user-info-dropmenu #userId").text(res.userInfo.user.currentName);
        $(".user-name").text(res.userInfo.user.currentName);

        $("#userInfoId").text(res.userInfo.user.currentName);
        $("#userLeftId").text(res.userInfo.user.currentName);

        //com.showImg($("#personalPic"), res.userInfo.user.userPhoto, 180, 180, '');
        com.showImg($("#userImg"), res.userInfo.user.userPhoto, 30, 30, '');
        com.showImg($("#userImgleft"), res.userInfo.user.userPhoto, 30, 30, '');
        com.showImg($("#userImgtop"), res.userInfo.user.userPhoto, 60, 60, '');

		com.post(api.system.queryCompanyByCid,{"company.cid": res.userInfo.user.companys},function(data){

			params.company = data.company;

			$(".companyinfo .companyName").text(data.company.name)

		}, null, false);

    }, null, false);

    com.post(api.personel.queryUserCompany, {"user.uid": params.userInfo.user.uid}, function (res) {

        var companysel = $('#companysel').html("");

        $.each(res.userCompanys, function(i,v){
            var $li = $('<li></li>').appendTo(companysel);
            var $a = $('<a></a>').attr('data-cid',v.company.cid).text(v.company.name).appendTo($li);
            $a.click(function(e){
                 com.post(api.common.changeAuthCode,{"company": v.company.cid },function(res){

					 for(var key in params){
						 if(key.indexOf("PostData")!=-1){
							 params[key] = null;
						 }
					 }
                     params.authentication = res.authentication;

                     com.switchPage(api.index.homeIndex.url);

                     // 切换公司后 目录所有菜单收起
                     $('li','ul.nav-list').removeClass('open').removeClass('active');
                     $('ul.nav-list li').first().addClass('active');

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
		$this = $(this);
		navControl($this);

		e.preventDefault();
		var hrefStr = $this.attr("href");
		if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
			com.switchPage(hrefStr);
		}
	});
	
	$(".changePassword").on("click", function(e){
		$this = $(this);
		navControl($this);

		e.preventDefault();
		var hrefStr = $this.attr("href");
		if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
			com.switchPage(hrefStr);
		}
	});
	
	$("#indexBtn").on("click", function(e){
		com.switchPage('home.html');
		return false;
	});
	
	$(".messageList").on("click", function(e){
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
		$('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;版本');
		com.switchPage(api.index.versionIndex.url);
		$('.breadcrumb .nav2').hide();
		$('.breadcrumb .nav3').hide();
	});
	
	$("#faqInfo").on("click", function(e){
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
        $this = $(this);
        navControl($this);

        e.preventDefault();
        var hrefStr = $this.attr("href");
        if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
            com.switchPage(hrefStr);
        }
        $('.breadcrumb .nav1').empty().append('<i class="fa fa-fw ti-comments"></i>&nbsp;消息查看');
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
	
});
